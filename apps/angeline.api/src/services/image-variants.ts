import { createHash } from 'node:crypto';
import { lstat, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import * as sharp from 'sharp';

export const VARIANT_WIDTHS = ['384', '640', '1080', '1600'] as const;
export const MAX_IMAGE_PIXELS = 64_000_000;
const MAX_WEBP_DIMENSION = 16383;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Deliberately reject ASCII control characters in persisted filenames.
// eslint-disable-next-line no-control-regex
const SAFE_SEGMENT = /^[^/\\\x00-\x1f\x7f:]{1,255}$/u;

export interface ImageSource {
  id: string;
  category: string;
  path: string;
}

export const isImageUuid = (id: string) => id.length === 36 && UUID.test(id);
export const isImageSegment = (value: string) =>
  typeof value === 'string' &&
  value.trim() === value &&
  value !== '.' &&
  value !== '..' &&
  SAFE_SEGMENT.test(value);
export const isVariantWidth = (width: string) =>
  VARIANT_WIDTHS.some((candidate) => candidate === width);

export function isMissingFile(error: unknown) {
  return ['ENOENT', 'ENOTDIR'].includes(
    (error as NodeJS.ErrnoException).code ?? '',
  );
}

export async function isRegularFile(path: string) {
  try {
    return (await lstat(path)).isFile();
  } catch (error) {
    if (isMissingFile(error)) return false;
    throw error;
  }
}

export function imageOriginalPath(imageRoot: string, source: ImageSource) {
  if (!isImageSegment(source.category) || !isImageSegment(source.path)) {
    throw new Error('Invalid image source path');
  }
  return resolve(imageRoot, 'img', source.category, source.path);
}

function versionDirectory(imageRoot: string) {
  return resolve(imageRoot, 'image-variants', 'v1');
}

export function imageVariantDirectory(imageRoot: string, id: string) {
  if (!isImageUuid(id)) throw new Error('Invalid image UUID');
  return join(versionDirectory(imageRoot), id);
}

function sourceMarker(directory: string, source: ImageSource) {
  const fingerprint = createHash('sha256')
    .update(JSON.stringify([source.category, source.path]))
    .digest('hex');
  return join(directory, `.source-${fingerprint}`);
}

export function variantMatchesSource(imageRoot: string, source: ImageSource) {
  return isRegularFile(
    sourceMarker(imageVariantDirectory(imageRoot, source.id), source),
  );
}

export async function removeImageVariants(imageRoot: string, id: string) {
  if (isImageUuid(id)) {
    await rm(imageVariantDirectory(imageRoot, id), {
      recursive: true,
      force: true,
    });
  }
}

export type VariantResult =
  | 'generated'
  | 'existing'
  | 'unsupported'
  | 'source-changed';

/** Stage the whole immutable v1 set on the same filesystem before publishing. */
export async function generateImageVariants(
  imageRoot: string,
  source: ImageSource,
  original = imageOriginalPath(imageRoot, source),
): Promise<VariantResult> {
  if (!isImageUuid(source.id)) return 'unsupported';
  const target = imageVariantDirectory(imageRoot, source.id);
  const marker = sourceMarker(target, source);
  if (await isRegularFile(marker)) return 'existing';
  try {
    // A changed source must not replace bytes at an already published UUID/v1 URL.
    await lstat(target);
    return 'source-changed';
  } catch (error) {
    if (!isMissingFile(error)) throw error;
  }

  const input = sharp(original, { limitInputPixels: MAX_IMAGE_PIXELS });
  const { pages, autoOrient } = await input.metadata();
  if ((pages ?? 1) > 1 || !autoOrient.width || !autoOrient.height) {
    return 'unsupported';
  }
  const widths = VARIANT_WIDTHS.filter(
    (width) =>
      Number(width) <= autoOrient.width &&
      Math.round((autoOrient.height * Number(width)) / autoOrient.width) <=
        MAX_WEBP_DIMENSION,
  );

  const parent = versionDirectory(imageRoot);
  await mkdir(parent, { recursive: true });
  const staging = await mkdtemp(join(parent, '.staging-'));
  try {
    for (const width of widths) {
      await input
        .clone()
        .autoOrient()
        .resize({ width: Number(width), withoutEnlargement: true })
        .webp({ quality: 82, effort: 3 })
        .toFile(join(staging, `${width}.webp`));
    }
    await input
      .clone()
      .autoOrient()
      .resize(25, 25, { withoutEnlargement: true })
      .blur(10)
      .webp({ quality: 70, effort: 2 })
      .toFile(join(staging, 'blur.webp'));
    await writeFile(sourceMarker(staging, source), '', { flag: 'wx' });

    try {
      // rename refuses to replace a non-empty directory; competing writers never clobber v1.
      await rename(staging, target);
    } catch (error) {
      if (await isRegularFile(marker)) return 'existing';
      throw error;
    }
    return 'generated';
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}
