import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as sharp from 'sharp';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { config } from '../src/config/config';
import { ImageController } from '../src/controllers/image.controller';
import { Category } from '../src/entities/category.entity';
import { Image } from '../src/entities/image.entity';
import { AuthGuard } from '../src/middleware/AuthGuard';
import { ImageRepository } from '../src/repositories/image.repository';
import { ImageService } from '../src/services/image.service';
import {
  imageOriginalPath,
  imageVariantDirectory,
} from '../src/services/image-variants';

const category = 'fixture';
const auth = { Authorization: 'Bearer synthetic' };

async function jpeg(width: number, height: number, orientation = 1) {
  return sharp({
    create: { width, height, channels: 3, background: '#219671' },
  })
    .withMetadata({ orientation })
    .jpeg()
    .toBuffer();
}

function row(body: unknown): Image {
  return body as Image;
}

const url = (id: string, width: number | string) =>
  `/image/${id}/variant/v1/${width}`;

describe('image variants over HTTP with real SQLite and temporary storage', () => {
  let app: INestApplication<App>;
  let db: DataSource;
  let root: string;
  let http: ReturnType<typeof request>;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'angeline-image-http-'));
    jest.replaceProperty(config, 'image_path', root);
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          entities: [Category, Image],
        }),
      ],
      controllers: [ImageController],
      providers: [ImageRepository, ImageService],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: {
          switchToHttp: () => {
            getRequest: () => { headers: { authorization: string } };
          };
        }) =>
          context.switchToHttp().getRequest().headers.authorization ===
          auth.Authorization,
      })
      .compile();
    app = module.createNestApplication();
    await app.init();
    db = app.get(DataSource);
    await db
      .getRepository(Category)
      .insert({ id: category, name: 'Synthetic', ordered: 1, disabled: true });
    http = request(app.getHttpServer());
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await app?.close();
    if (root) await rm(root, { recursive: true, force: true });
  });

  async function importLegacy(data: Buffer) {
    const response = await http
      .post(`/image/${category}`)
      .set(auth)
      .attach('images', data, 'synthetic.jpg')
      .expect(201);
    return (response.body as Image[])[0];
  }

  it('keeps auth for imports and serves only exact, precomputed, oriented WebPs', async () => {
    const original = await jpeg(900, 1800, 6);
    await http
      .post(`/image/${category}`)
      .attach('images', original, 'synthetic.jpg')
      .expect(403);
    const image = await importLegacy(original);

    // The disabled category continues to follow the existing UUID image-access contract.
    const raw = await http
      .get(`/image/${image.id}`)
      .expect(200)
      .expect('Content-Type', /jpeg/);
    expect(await sharp(raw.body as Buffer).metadata()).toMatchObject({
      width: 1800,
      height: 900,
    });
    for (const width of [384, 640, 1080, 1600]) {
      const response = await http
        .get(url(image.id, width))
        .expect(200)
        .expect('Content-Type', /image\/webp/)
        .expect('Cache-Control', 'public, max-age=31536000, immutable')
        .expect('X-Robots-Tag', 'noindex');
      const stored = join(
        imageVariantDirectory(root, image.id),
        `${width}.webp`,
      );
      expect(response.body).toEqual(await readFile(stored));
      expect(await sharp(response.body as Buffer).metadata()).toMatchObject({
        format: 'webp',
        width,
        height: width / 2,
      });
    }
    const blur = await http
      .get(`/image/${image.id}/blur`)
      .expect(200)
      .expect('Content-Type', /webp/);
    expect(await sharp(blur.body as Buffer).metadata()).toMatchObject({
      width: 25,
      height: 25,
    });
    const head = await http.head(url(image.id, 640)).expect(200);
    await http
      .get(url(image.id, 640))
      .set('If-None-Match', head.headers.etag)
      .expect(304);
  });

  it('does not upscale, convert on a variant miss, or query the DB on invalid/missing files', async () => {
    const image = await importLegacy(await jpeg(500, 250));
    const variantDir = imageVariantDirectory(root, image.id);
    const before = await readdir(variantDir);
    const query = jest.spyOn(app.get(ImageRepository), 'findOne');
    for (const [id, width] of [
      [image.id, 640],
      [image.id, '0384'],
      [image.id, '99999999'],
      ['invalid', 384],
      [uuid(), 384],
    ] as const) {
      await http
        .get(url(id, width))
        .expect(404)
        .expect('Cache-Control', 'no-store');
    }
    expect(query).not.toHaveBeenCalled();
    expect(await readdir(variantDir)).toEqual(before);
    await http.get(url(image.id, 384)).expect(200);
    expect(before).not.toContain('640.webp');
    const small = await importLegacy(await jpeg(200, 100));
    await http.get(url(small.id, 384)).expect(404);
    await http.get(`/image/${small.id}`).expect(200);
  });

  it('streams chunk imports in index order and preserves original bytes/orientation', async () => {
    // Insert a valid large JPEG metadata segment so the test spans two chunks.
    const jpegBytes = await jpeg(450, 900, 6);
    const payload = Buffer.alloc(65_533);
    const data = Buffer.concat([
      jpegBytes.subarray(0, 2),
      Buffer.from([0xff, 0xef, 0xff, 0xff]),
      payload,
      jpegBytes.subarray(2),
    ]);
    const fileHash = 'test-chunk';
    const chunkSize = 65536;
    const initiate = {
      fileName: 'test.jpg',
      category,
      fileHash,
      fileSize: data.length,
      chunkSize,
    };
    await http
      .post('/image/chunk/initiate')
      .set(auth)
      .send(initiate)
      .expect(201);
    const sendChunk = (index: number, chunk: Buffer) =>
      http
        .post('/image/chunk/upload')
        .set(auth)
        .field('fileHash', fileHash)
        .field('chunkIndex', `${index}`)
        .field('totalChunks', '2')
        .attach('chunk', chunk, 'blob.bin');
    await sendChunk(0, Buffer.from('short')).expect(400);
    await sendChunk(1, data.subarray(chunkSize)).expect(201);
    await sendChunk(0, data.subarray(0, chunkSize)).expect(201);
    await http
      .post('/image/chunk/complete')
      .set(auth)
      .send({ fileHash, category: 'other' })
      .expect(400);
    const done = await http
      .post('/image/chunk/complete')
      .set(auth)
      .send({ fileHash, category })
      .expect(201);
    const image = row(done.body);
    expect(await readFile(imageOriginalPath(root, image))).toEqual(data);
    const response = await http.get(url(image.id, 640)).expect(200);
    expect(await sharp(response.body as Buffer).metadata()).toMatchObject({
      width: 640,
      height: 320,
    });
    await http.get(url(image.id, 1080)).expect(404);
    await http.get(`/image/chunk/status/${fileHash}`).set(auth).expect(404);
    expect(await readdir(join(root, 'img', 'temp'))).toEqual([]);
  });

  it('does not publish an original, row or bundle for an invalid chunk import', async () => {
    await http
      .post('/image/chunk/initiate')
      .set(auth)
      .send({
        fileName: 'test.jpg',
        category,
        fileHash: 'bad',
        fileSize: 3,
      })
      .expect(201);
    await http
      .post('/image/chunk/upload')
      .set(auth)
      .field('fileHash', 'bad')
      .field('chunkIndex', '0')
      .field('totalChunks', '1')
      .attach('chunk', Buffer.from('bad'), 'blob')
      .expect(201);
    await http
      .post('/image/chunk/complete')
      .set(auth)
      .send({ fileHash: 'bad', category })
      .expect(400);
    expect(await db.getRepository(Image).count()).toBe(0);
    expect(await readdir(join(root, 'img', category))).toEqual([]);
    expect(await readdir(root)).toEqual(['img']);
  });

  it('checks source changes, direct delete, and parent category cascade before serving', async () => {
    const first = await importLegacy(await jpeg(500, 250));
    const second = await importLegacy(await jpeg(500, 250));
    await http
      .put(`/image/${first.id}`)
      .set(auth)
      .send({ path: 'new.jpg' })
      .expect(200);
    await http.get(url(first.id, 384)).expect(404);
    await http.get(`/image/${first.id}/blur`).expect(404);
    await http
      .put(`/image/${first.id}`)
      .set(auth)
      .send({ path: first.path })
      .expect(200);
    await http.delete(`/image/${first.id}`).set(auth).expect(200);
    await expect(
      readdir(imageVariantDirectory(root, first.id)),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    await http.get(url(first.id, 384)).expect(404);

    // This is the operation used by CategoryService.delete: only the database is touched.
    await db.getRepository(Category).delete(category);
    expect(await readdir(imageVariantDirectory(root, second.id))).toContain(
      '384.webp',
    );
    await http.get(`/image/${second.id}`).expect(404);
    await http
      .get(url(second.id, 384))
      .expect(404)
      .expect('Cache-Control', 'no-store');
  });

  it('keeps a successful original import when variant storage is unavailable', async () => {
    await writeFile(join(root, 'image-variants'), 'not a directory');
    const image = await importLegacy(await jpeg(500, 250));
    expect(await db.getRepository(Image).count()).toBe(1);
    await http.get(url(image.id, 384)).expect(404);
    await http
      .get(`/image/${image.id}`)
      .expect(200)
      .expect('Content-Type', /jpeg/);
  });

  it('serves existing legacy blurs without generating or downloading originals on GET', async () => {
    const id = uuid();
    const image = {
      id,
      category,
      path: `${id}.jpg`,
      name: 'fixture.name.jpg',
      ordered: 1,
    };
    await db.getRepository(Image).insert(image);
    const original = await jpeg(100, 50);
    const originalPath = imageOriginalPath(root, image);
    const directory = join(root, 'img', category);
    await mkdir(directory, { recursive: true });
    await writeFile(originalPath, original);
    await http.get(`/image/${id}/blur`).expect(404);
    expect(await readdir(directory)).toEqual([image.path]);
    const legacy = await jpeg(25, 25);
    await writeFile(join(directory, 'fixture.blur.name'), legacy);
    const preview = await http
      .get(`/image/${id}/blur`)
      .buffer(true)
      .parse((res, done) => {
        const parts: Buffer[] = [];
        res
          .on('data', (chunk: Buffer) => parts.push(chunk))
          .once('end', () => done(null, Buffer.concat(parts)));
      })
      .expect(200);
    expect(preview.body).toEqual(legacy);
    await http.get(url(id, 384)).expect(404);
  });
});
