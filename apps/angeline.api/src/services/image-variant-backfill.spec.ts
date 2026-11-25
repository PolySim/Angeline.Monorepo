import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as sharp from 'sharp';
import { DataSource } from 'typeorm';
import { config } from '../config/config';
import { Category } from '../entities/category.entity';
import { Image } from '../entities/image.entity';
import { runImageBackfill } from './image-variant-backfill';
import {
  generateImageVariants,
  imageOriginalPath,
  imageVariantDirectory,
} from './image-variants';

const category = 'fixture';
const source = (n: number) => ({
  id: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
  category,
  path: `${n}.png`,
  name: `${n}.png`,
  ordered: n,
});

describe('local image backfill', () => {
  let sandbox: string;
  let database: string;
  let imageRoot: string;
  let args: string[];

  beforeEach(async () => {
    sandbox = await mkdtemp(join(tmpdir(), 'angeline-image-backfill-'));
    database = join(sandbox, 'fixture.sqlite');
    imageRoot = join(sandbox, 'images');
    await mkdir(join(imageRoot, 'img', category), { recursive: true });
    args = ['--sandbox', sandbox];
    jest.replaceProperty(config, 'database_path', database);
    jest.replaceProperty(config, 'image_path', imageRoot);
    jest.replaceProperty(process, 'env', { ...process.env, NODE_ENV: 'test' });
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    if (sandbox) await rm(sandbox, { recursive: true, force: true });
  });

  async function fixture(n: number) {
    await sharp({
      create: { width: 800, height: 400, channels: 3, background: '#579113' },
    })
      .png()
      .toFile(imageOriginalPath(imageRoot, source(n)));
  }

  async function seedRows(...ids: number[]) {
    const db = new DataSource({
      type: 'sqlite',
      database,
      entities: [Category, Image],
      synchronize: true,
    });
    await db.initialize();
    try {
      await db
        .getRepository(Category)
        .insert({ id: category, name: 'Synthetic', ordered: 1 });
      await db.getRepository(Image).insert(ids.map(source));
    } finally {
      await db.destroy();
    }
  }

  it('pages by UUID, leaves the DB unchanged, skips existing bundles, and isolates bad rows', async () => {
    await seedRows(1, 2, 3);
    await fixture(1);
    await fixture(3);
    const initialDb = await readFile(database);
    const first = await runImageBackfill([...args, '--limit', '1']);
    expect(first).toMatchObject({
      processed: 1,
      generated: 1,
      failed: 0,
      nextAfter: source(1).id,
    });
    const variant = join(
      imageVariantDirectory(imageRoot, source(1).id),
      '640.webp',
    );
    const { ino, mtimeMs } = await lstat(variant);
    expect(await runImageBackfill([...args, '--limit', '1'])).toMatchObject({
      generated: 0,
      existing: 1,
    });
    expect(await lstat(variant)).toMatchObject({ ino, mtimeMs });
    const second = await runImageBackfill([
      ...args,
      '--after',
      first.nextAfter!,
    ]);
    expect(second).toMatchObject({
      processed: 2,
      generated: 1,
      failed: 1,
      nextAfter: null,
    });
    expect(await readFile(database)).toEqual(initialDb);
  });

  it('refuses production, missing opt-in, excessive limits, and symlinked outputs', async () => {
    await seedRows(1);
    await fixture(1);
    process.env.NODE_ENV = 'production';
    await expect(runImageBackfill(args)).rejects.toThrow(
      'disabled in production',
    );
    process.env.NODE_ENV = 'test';
    await expect(runImageBackfill([])).rejects.toThrow('explicit --sandbox');
    await expect(runImageBackfill([...args, '--limit', '501'])).rejects.toThrow(
      '--limit',
    );
    const destination = join(sandbox, 'not-the-output');
    await mkdir(destination);
    await symlink(destination, join(imageRoot, 'image-variants'));
    await expect(runImageBackfill(args)).rejects.toThrow(
      'must not be symlinks',
    );
    expect(await readdir(destination)).toEqual([]);
  });

  it('does not follow original symlinks, even within the local sandbox', async () => {
    await seedRows(1, 2);
    await fixture(2);
    await symlink(
      imageOriginalPath(imageRoot, source(2)),
      imageOriginalPath(imageRoot, source(1)),
    );
    await expect(runImageBackfill(args)).resolves.toMatchObject({
      generated: 1,
      failed: 1,
    });
  });

  it('publishes one complete bundle from competing writers and does not replace immutable bytes', async () => {
    await fixture(1);
    const first = source(1);
    const results = await Promise.all([
      generateImageVariants(imageRoot, first),
      generateImageVariants(imageRoot, first),
    ]);
    expect(results.sort()).toEqual(['existing', 'generated']);
    expect(await readdir(join(imageRoot, 'image-variants', 'v1'))).toEqual([
      first.id,
    ]);
    const bundle = imageVariantDirectory(imageRoot, first.id);
    expect(
      (await readdir(bundle)).filter((file) => !file.startsWith('.')).sort(),
    ).toEqual(['384.webp', '640.webp', 'blur.webp']);
    expect(
      await generateImageVariants(imageRoot, { ...first, path: 'changed.png' }),
    ).toBe('source-changed');
    await writeFile(imageOriginalPath(imageRoot, source(2)), 'not a photo');
    await expect(generateImageVariants(imageRoot, source(2))).rejects.toThrow();
    expect(await readdir(join(imageRoot, 'image-variants', 'v1'))).toEqual([
      first.id,
    ]);
  });
});
