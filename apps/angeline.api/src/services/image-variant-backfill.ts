import 'reflect-metadata';
import { lstat, realpath, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { parseArgs } from 'node:util';
import { OPEN_READONLY } from 'sqlite3';
import { DataSource } from 'typeorm';
import { config } from '../config/config';
import { Category } from '../entities/category.entity';
import { Image } from '../entities/image.entity';
import {
  generateImageVariants,
  imageOriginalPath,
  isImageUuid,
  isMissingFile,
  isRegularFile,
} from './image-variants';

function within(root: string, path: string) {
  return path === root || path.startsWith(`${root}${sep}`);
}

function lstatIfPresent(path: string) {
  return lstat(path).catch((error: unknown) => {
    if (!isMissingFile(error)) throw error;
  });
}

async function checkedSandbox(raw: string | undefined) {
  if (/^prod(?:uction)?$/i.test(process.env.NODE_ENV ?? '')) {
    throw new Error('Backfill is disabled in production');
  }
  if (!raw) throw new Error('An explicit --sandbox is required');
  const input = resolve(raw);
  const sandbox = await realpath(input);
  if (
    !(await lstat(input)).isDirectory() ||
    !basename(sandbox).startsWith('angeline-image-backfill-') ||
    dirname(sandbox) !== (await realpath(tmpdir()))
  ) {
    throw new Error(
      'Use a dedicated angeline-image-backfill-* directory directly under the OS temp directory',
    );
  }
  async function checkedPath(value: string) {
    const configured = resolve(value);
    if (!within(input, configured)) {
      throw new Error(
        'Configured database and image paths must be in the sandbox',
      );
    }
    const canonical = await realpath(configured);
    if (
      !within(sandbox, canonical) ||
      canonical !== resolve(sandbox, relative(input, configured))
    ) {
      throw new Error(
        'Configured database and image paths must be in the sandbox, without symlinks',
      );
    }
    return canonical;
  }
  const database = await checkedPath(config.database_path);
  const imageRoot = await checkedPath(config.image_path);
  if (
    !(await isRegularFile(database)) ||
    !(await stat(imageRoot)).isDirectory()
  ) {
    throw new Error(
      'The sandbox must contain a database file and image directory',
    );
  }
  for (const suffix of ['-wal', '-shm', '-journal']) {
    const info = await lstatIfPresent(`${database}${suffix}`);
    if (info && !info.isFile())
      throw new Error('SQLite sidecars must not be symlinks');
  }
  const output = join(imageRoot, 'image-variants');
  for (const path of [output, join(output, 'v1')]) {
    const info = await lstatIfPresent(path);
    if (info && !info.isDirectory())
      throw new Error('The variant output directories must not be symlinks');
  }
  return { database, imageRoot };
}

export async function runImageBackfill(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      sandbox: { type: 'string' },
      limit: { type: 'string', default: '100' },
      after: { type: 'string' },
    },
  });
  const limit = Number(values.limit);
  if (
    !/^\d{1,3}$/.test(values.limit) ||
    limit < 1 ||
    limit > 500 ||
    (values.after?.length ?? 0) > 255
  ) {
    throw new Error('Use --limit 1..500 and the last reported --after cursor');
  }
  const { database, imageRoot } = await checkedSandbox(values.sandbox);
  const dataSource = new DataSource({
    type: 'sqlite',
    database,
    flags: OPEN_READONLY,
    entities: [Category, Image],
    synchronize: false,
    logging: false,
  });
  await dataSource.initialize();
  try {
    const query = dataSource
      .getRepository(Image)
      .createQueryBuilder('image')
      .select(['image.id', 'image.category', 'image.path'])
      .orderBy('image.id', 'ASC')
      .take(limit + 1);
    if (values.after !== undefined)
      query.where('image.id > :after', { after: values.after });
    const rows = await query.getMany();
    const page = rows.slice(0, limit);
    const counts = {
      generated: 0,
      existing: 0,
      unsupported: 0,
      'source-changed': 0,
      failed: 0,
    };
    for (const source of page) {
      if (!isImageUuid(source.id)) {
        counts.unsupported++;
        continue;
      }
      try {
        const original = imageOriginalPath(imageRoot, source);
        if (
          !(await isRegularFile(original)) ||
          (await realpath(original)) !== original
        ) {
          throw new Error('Original missing or symlinked');
        }
        counts[await generateImageVariants(imageRoot, source, original)]++;
      } catch {
        counts.failed++;
      }
    }
    return {
      processed: page.length,
      ...counts,
      nextAfter: rows.length > limit ? rows[limit - 1].id : null,
    };
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  void runImageBackfill(process.argv.slice(2))
    .then((report) => {
      console.log(JSON.stringify(report));
      if (report.failed) process.exitCode = 2;
    })
    .catch(() => {
      // Avoid printing configured paths, row contents, or SQLite connection details.
      console.error(
        'Backfill refused or could not start. Check NODE_ENV, --sandbox, local paths and --limit.',
      );
      process.exitCode = 1;
    });
}
