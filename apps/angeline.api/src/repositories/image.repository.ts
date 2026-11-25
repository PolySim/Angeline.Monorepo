import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as archiver from 'archiver';
import * as fs from 'node:fs';
import { mkdir, mkdtemp, rename, rm, stat, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import * as sharp from 'sharp';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';
import { Image } from '../entities/image.entity';
import {
  generateImageVariants,
  imageOriginalPath,
  imageVariantDirectory,
  isImageSegment,
  isImageUuid,
  isMissingFile,
  isRegularFile,
  isVariantWidth,
  MAX_IMAGE_PIXELS,
  removeImageVariants,
  variantMatchesSource,
} from '../services/image-variants';
import { UpdateImageDto } from '../types';
import {
  ChunkStatusDto,
  ChunkUploadDto,
  CompleteUploadDto,
  InitiateUploadDto,
} from '../types/chunk.dto';

const MIB = 1024 * 1024;
export const LEGACY_IMAGE_LIMITS = { files: 10, fileSize: 20 * MIB };
export const CHUNK_LIMIT = MIB;
const MAX_CHUNKED_IMAGE_BYTES = 100 * MIB;
const MAX_CHUNK_SESSIONS = 32;
const MAX_IMPORTS = 2;
const MAX_WAITING_IMPORTS = 8;
const SAFE_UPLOAD_KEY = /^[a-zA-Z0-9_-]{1,128}$/;

export interface ImageUpload {
  originalname: string;
  buffer: Buffer;
}

function validateCategory(category: string) {
  if (!isImageSegment(category) || category.toLowerCase() === 'temp') {
    throw new BadRequestException('Catégorie invalide');
  }
}

function importPath(id: string, name: string) {
  const ext = typeof name === 'string' && name.split('.').pop();
  if (!ext || !/^[a-zA-Z0-9]{1,10}$/.test(ext)) {
    throw new BadRequestException('Extension de fichier invalide');
  }
  return `${id}.${ext}`;
}

interface ChunkUploadSession {
  fileName: string;
  category: string;
  totalChunks: number;
  fileSize: number;
  chunkSize: number;
  uploadedChunks: Set<number>;
  chunkPaths: Map<number, string>;
  createdAt: Date;
  completing: boolean;
}

@Injectable()
export class ImageRepository
  extends Repository<Image>
  implements OnModuleDestroy
{
  private readonly logger = new Logger(ImageRepository.name);
  private readonly uploadSessions = new Map<string, ChunkUploadSession>();
  private readonly cleanupTimer = setInterval(
    () => this.cleanupExpiredSessions(),
    60 * 60 * 1000,
  ).unref();
  private readonly importWaiters: Array<() => void> = [];
  private activeImports = 0;

  constructor(dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
  }

  onModuleDestroy() {
    clearInterval(this.cleanupTimer);
  }

  private async withImportSlot<T>(operation: () => Promise<T>): Promise<T> {
    if (this.activeImports < MAX_IMPORTS) {
      this.activeImports++;
    } else {
      if (this.importWaiters.length >= MAX_WAITING_IMPORTS) {
        throw new ServiceUnavailableException("Trop d'imports en cours");
      }
      await new Promise<void>((resolve) => this.importWaiters.push(resolve));
    }
    try {
      return await operation();
    } finally {
      const next = this.importWaiters.shift();
      if (next) next();
      else this.activeImports--;
    }
  }

  async findByCategory(categoryId: string): Promise<Image[]> {
    return this.find({
      where: { category: categoryId },
      order: { ordered: 'ASC' },
    });
  }

  async sendImage(id: string) {
    const image = await this.findOne({
      where: {
        id: id,
      },
    });

    if (!image) {
      throw new HttpException('Image non trouvée', HttpStatus.NOT_FOUND);
    }

    return imageOriginalPath(config.image_path, image);
  }

  async sendImageBlur(id: string) {
    const image = await this.findOne({
      where: {
        id: id,
      },
    });

    if (!image || !image.name) {
      throw new HttpException('Image non trouvée', HttpStatus.NOT_FOUND);
    }

    if (
      isImageUuid(id) &&
      (await variantMatchesSource(config.image_path, image))
    ) {
      const blur = join(
        imageVariantDirectory(config.image_path, id),
        'blur.webp',
      );
      if (await isRegularFile(blur)) return blur;
    }

    const [base, extension] = image.name.split('.');
    const legacyBlur = `${base}.blur.${extension}`;
    if (extension && isImageSegment(legacyBlur)) {
      const path = imageOriginalPath(config.image_path, {
        ...image,
        path: legacyBlur,
      });
      if (await isRegularFile(path)) return path;
    }
    // A missing placeholder must not trigger a second full-resolution download.
    throw new NotFoundException();
  }

  async sendImageVariant(id: string, width: string) {
    if (!isImageUuid(id) || !isVariantWidth(width))
      throw new NotFoundException();
    const filename = join(
      imageVariantDirectory(config.image_path, id),
      `${width}.webp`,
    );
    if (!(await isRegularFile(filename))) throw new NotFoundException();

    // Category DELETE cascades in SQLite but does not remove files from disk.
    // Disabled categories are still readable by UUID on the original route.
    const image = await this.findOne({
      where: { id },
      select: { id: true, category: true, path: true },
    });
    if (!image || !(await variantMatchesSource(config.image_path, image))) {
      throw new NotFoundException();
    }
    return filename;
  }

  async createImage(category: string, files: ImageUpload[]): Promise<Image[]> {
    validateCategory(category);
    const saved: Image[] = [];
    for (const file of files) {
      saved.push(
        await this.withImportSlot(async () => {
          const id = uuidv4();
          return this.saveImport(
            id,
            category,
            file.originalname,
            async (staged) => {
              try {
                // Keep the legacy re-encode (including metadata stripping), but bake in EXIF orientation.
                await sharp(file.buffer, { limitInputPixels: MAX_IMAGE_PIXELS })
                  .autoOrient()
                  .toFile(staged);
              } catch {
                throw new BadRequestException(
                  "Le fichier n'est pas une image valide ou prise en charge",
                );
              }
            },
          );
        }),
      );
    }
    return saved;
  }

  private async saveImport(
    id: string,
    category: string,
    name: string,
    writeOriginal: (staged: string) => Promise<void>,
  ): Promise<Image> {
    const image = this.create({
      id,
      category,
      name,
      path: importPath(id, name),
    });
    const original = imageOriginalPath(config.image_path, image);
    const directory = join(config.image_path, 'img', category);
    await mkdir(directory, { recursive: true });
    const staging = await mkdtemp(join(directory, '.import-'));
    let saved: Image;
    try {
      const staged = join(staging, image.path);
      await writeOriginal(staged);
      image.ordered = (await this.count({ where: { category } })) + 1;
      await rename(staged, original);
      try {
        saved = await this.save(image);
      } catch (error) {
        await rm(original, { force: true });
        throw error;
      }
    } finally {
      await rm(staging, { recursive: true, force: true }).catch(() => {
        this.logger.warn('Temporary import directory pending cleanup');
      });
    }
    try {
      await generateImageVariants(config.image_path, saved, original);
      if (!(await this.existsBy({ id })))
        await removeImageVariants(config.image_path, id);
    } catch {
      // The original is committed; generation failure must not cause duplicate imports on retry.
      this.logger.warn('Image import completed without precomputed variants');
    }
    return saved;
  }

  async deleteImage(id: string): Promise<void> {
    const image = await this.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    try {
      await unlink(imageOriginalPath(config.image_path, image));
    } catch (error) {
      if (!isMissingFile(error)) throw error;
    }
    await this.delete(id);
    try {
      await removeImageVariants(config.image_path, id);
    } catch {
      this.logger.warn('Deleted image has precomputed files pending cleanup');
    }
  }

  async updateImage(
    id: string,
    updateDto: UpdateImageDto,
  ): Promise<Image | null> {
    await this.update(id, updateDto);
    return this.findOne({ where: { id } });
  }

  async reorderImages(_categoryId: string, imageIds: string[]): Promise<void> {
    for (let i = 0; i < imageIds.length; i++) {
      await this.update(imageIds[i], { ordered: i + 1 });
    }
  }

  initiateChunkUpload(initiateUploadDto: InitiateUploadDto) {
    const {
      fileHash,
      fileName,
      category,
      fileSize,
      chunkSize = 512 * 1024,
    } = initiateUploadDto;
    validateCategory(category);
    importPath('upload', fileName);
    if (
      typeof fileHash !== 'string' ||
      !SAFE_UPLOAD_KEY.test(fileHash) ||
      !Number.isSafeInteger(fileSize) ||
      fileSize < 1 ||
      fileSize > MAX_CHUNKED_IMAGE_BYTES ||
      !Number.isSafeInteger(chunkSize) ||
      chunkSize < 64 * 1024 ||
      chunkSize > CHUNK_LIMIT
    ) {
      throw new BadRequestException("Paramètres d'upload invalides");
    }
    if (this.uploadSessions.get(fileHash)?.completing) {
      throw new BadRequestException('Finalisation déjà en cours');
    }
    if (
      !this.uploadSessions.has(fileHash) &&
      this.uploadSessions.size >= MAX_CHUNK_SESSIONS
    ) {
      throw new ServiceUnavailableException(
        "Trop de sessions d'upload en cours",
      );
    }

    const totalChunks = Math.ceil(fileSize / chunkSize);
    this.cleanupTempFiles(fileHash);
    fs.mkdirSync(join(config.image_path, 'img', 'temp', fileHash), {
      recursive: true,
    });

    const session: ChunkUploadSession = {
      fileName,
      category,
      totalChunks,
      fileSize,
      chunkSize,
      uploadedChunks: new Set(),
      chunkPaths: new Map(),
      createdAt: new Date(),
      completing: false,
    };

    this.uploadSessions.set(fileHash, session);

    return {
      fileHash,
      totalChunks,
      chunkSize,
      uploadId: fileHash,
    };
  }

  uploadChunk(chunk: ImageUpload, chunkUploadDto: ChunkUploadDto) {
    const { fileHash } = chunkUploadDto;

    const chunkIndex = Number(chunkUploadDto.chunkIndex ?? NaN);
    const totalChunks = Number(chunkUploadDto.totalChunks ?? NaN);

    const session = this.uploadSessions.get(fileHash);
    if (!session) {
      throw new BadRequestException("Session d'upload non trouvée");
    }

    if (
      session.completing ||
      totalChunks !== session.totalChunks ||
      !Number.isSafeInteger(chunkIndex) ||
      chunkIndex < 0 ||
      chunkIndex >= totalChunks
    ) {
      throw new BadRequestException('Index de chunk ou nombre total invalide');
    }
    const expected = Math.min(
      session.chunkSize,
      session.fileSize - chunkIndex * session.chunkSize,
    );
    if (chunk?.buffer?.length !== expected) {
      throw new BadRequestException('Taille de chunk invalide');
    }

    if (session.uploadedChunks.has(chunkIndex)) {
      return { success: true, message: 'Chunk déjà uploadé' };
    }

    const tempDir = join(config.image_path, 'img', 'temp', fileHash);
    const chunkPath = join(tempDir, `chunk_${chunkIndex}`);

    fs.writeFileSync(chunkPath, chunk.buffer);

    session.uploadedChunks.add(chunkIndex);
    session.chunkPaths.set(chunkIndex, chunkPath);

    return {
      success: true,
      uploadedChunks: session.uploadedChunks.size,
      totalChunks: session.totalChunks,
      isComplete: session.uploadedChunks.size === session.totalChunks,
    };
  }

  getChunkStatus(fileHash: string): ChunkStatusDto {
    const session = this.uploadSessions.get(fileHash);
    if (!session) {
      throw new NotFoundException("Session d'upload non trouvée");
    }

    return {
      fileHash,
      uploadedChunks: Array.from(session.uploadedChunks),
      totalChunks: session.totalChunks,
      isComplete: session.uploadedChunks.size === session.totalChunks,
    };
  }

  async completeChunkUpload(
    completeUploadDto: CompleteUploadDto,
  ): Promise<Image> {
    const { fileHash, category } = completeUploadDto;

    const session = this.uploadSessions.get(fileHash);
    if (!session) {
      throw new BadRequestException("Session d'upload non trouvée");
    }

    if (session.completing || category !== session.category) {
      throw new BadRequestException('Finalisation invalide');
    }
    if (session.uploadedChunks.size !== session.totalChunks) {
      throw new BadRequestException('Tous les chunks ne sont pas uploadés');
    }

    const { fileName, totalChunks, chunkPaths, fileSize } = session;
    session.completing = true;
    try {
      return await this.withImportSlot(async () => {
        try {
          return await this.saveImport(
            uuidv4(),
            category,
            fileName,
            async (staged) => {
              async function* chunks() {
                for (let i = 0; i < totalChunks; i++) {
                  const path = chunkPaths.get(i);
                  if (!path)
                    throw new BadRequestException(`Chunk ${i} manquant`);
                  yield* fs.createReadStream(path);
                }
              }
              await pipeline(
                Readable.from(chunks()),
                fs.createWriteStream(staged, { flags: 'wx' }),
              );
              if ((await stat(staged)).size !== fileSize) {
                throw new BadRequestException('Taille du fichier incorrecte');
              }
              try {
                await sharp(staged, {
                  limitInputPixels: MAX_IMAGE_PIXELS,
                }).metadata();
              } catch {
                throw new BadRequestException(
                  "Le fichier n'est pas une image valide ou prise en charge",
                );
              }
            },
          );
        } finally {
          this.uploadSessions.delete(fileHash);
          this.cleanupTempFiles(fileHash);
        }
      });
    } finally {
      session.completing = false;
    }
  }

  cancelChunkUpload(fileHash: string) {
    const session = this.uploadSessions.get(fileHash);
    if (!session) {
      // Session déjà supprimée, pas d'erreur
      return { success: true, message: 'Upload déjà annulé' };
    }

    if (session.completing)
      throw new BadRequestException('Finalisation déjà en cours');
    this.cleanupTempFiles(fileHash);
    this.uploadSessions.delete(fileHash);

    return { success: true, message: 'Upload annulé' };
  }

  private cleanupTempFiles(fileHash: string) {
    const tempDir = join(config.image_path, 'img', 'temp', fileHash);
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      this.logger.warn('Temporary upload files pending cleanup');
    }
  }

  private cleanupExpiredSessions() {
    const now = new Date();
    const expireTime = 24 * 60 * 60 * 1000; // 24 heures

    for (const [fileHash, session] of this.uploadSessions.entries()) {
      if (
        !session.completing &&
        now.getTime() - session.createdAt.getTime() > expireTime
      ) {
        this.cleanupTempFiles(fileHash);
        this.uploadSessions.delete(fileHash);
      }
    }
  }

  async createZipArchive(categoryId: string): Promise<string> {
    const images = await this.findByCategory(categoryId);

    if (images.length === 0) {
      throw new NotFoundException('Aucune image trouvée dans cette catégorie');
    }

    // Créer le répertoire temporaire pour le ZIP
    const tempZipDir = join(config.image_path, 'temp_zip');
    if (!fs.existsSync(tempZipDir)) {
      fs.mkdirSync(tempZipDir, { recursive: true });
    }

    const zipFileName = `category_${categoryId}_${Date.now()}.zip`;
    const zipFilePath = join(tempZipDir, zipFileName);

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Compression maximale
      });

      output.on('close', () => {
        resolve(zipFilePath);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      // Ajouter chaque image au ZIP
      images.forEach((image) => {
        const imagePath = join(
          config.image_path,
          'img',
          image.category,
          image.path,
        );
        if (fs.existsSync(imagePath)) {
          // Utiliser le nom original de l'image dans le ZIP
          archive.file(imagePath, { name: image.name || image.path });
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      archive.finalize();
    });
  }

  cleanupZipFile(zipFilePath: string): void {
    if (fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath);
    }
  }
}
