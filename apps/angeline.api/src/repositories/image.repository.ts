/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as archiver from 'archiver';
import { File } from 'multer';
import * as fs from 'node:fs';
import { join } from 'node:path';
import * as sharp from 'sharp';
import { config } from 'src/config/config';
import {
  ChunkStatusDto,
  ChunkUploadDto,
  CompleteUploadDto,
  InitiateUploadDto,
} from 'src/types/chunk.dto';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Image } from '../entities/image.entity';
import { UpdateImageDto } from '../types';

interface ChunkUploadSession {
  fileHash: string;
  fileName: string;
  category: string;
  totalChunks: number;
  fileSize: number;
  uploadedChunks: Set<number>;
  chunkPaths: Map<number | string, string>;
  createdAt: Date;
}

@Injectable()
export class ImageRepository extends Repository<Image> {
  private uploadSessions: Map<string, ChunkUploadSession> = new Map();

  constructor(private dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
    setInterval(() => this.cleanupExpiredSessions(), 60 * 60 * 1000);
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

    return `${config.image_path}/img/${image.category}/${image.path}`;
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

    const nameWithBlur = `${image.name.split('.')[0]}.blur.${image.name.split('.')[1]}`;
    const imagePath = `${config.image_path}/img/${image.category}/${image.path}`;

    // Vérification si l'image floutée existe déjà
    const blurredImagePath = `${config.image_path}/img/${image.category}/${nameWithBlur}`;

    if (!fs.existsSync(blurredImagePath)) {
      // Si l'image floutée n'existe pas, créer une version floutée
      await sharp(imagePath).resize(25, 25).blur(10).toFile(blurredImagePath);
    }

    return blurredImagePath;
  }

  async createImage(categoryId: string, files: File[]): Promise<Image[]> {
    const numberMax =
      (await this.count({
        where: {
          category: categoryId,
        },
      })) + 1;
    return await Promise.all(
      files.map(async (file, i) => {
        const newId = uuidv4();
        const path = `${newId}.${(file.originalname ?? '').split('.').slice(-1)[0]}`;
        const image = this.create({
          id: newId,
          category: categoryId,
          name: file.originalname ?? '',
          path,
          ordered: numberMax + i,
        });
        await this.uploadImage({ categoryId, name: path, file });
        const saved = await this.save(image);
        return saved;
      }),
    );
  }

  async deleteImage(id: string): Promise<void> {
    const image = await this.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    const imagePath = join(
      config.image_path,
      'img',
      image.category,
      image.path,
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await this.delete(id);
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

  private async uploadImage({
    categoryId,
    name,
    file,
  }: {
    categoryId: string;
    name: string;
    file: File;
  }) {
    const directoryPath = `${config.image_path}/img/${categoryId}`;
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await sharp(file.buffer).toFile(`${directoryPath}/${name}`);
  }

  initiateChunkUpload(initiateUploadDto: InitiateUploadDto) {
    const {
      fileHash,
      fileName,
      category,
      fileSize,
      chunkSize = 512 * 1024,
    } = initiateUploadDto; // 512KB en prod, 1MB en dev

    const totalChunks = Math.ceil(fileSize / chunkSize);

    // Créer le répertoire temporaire pour les chunks
    const tempDir = join(config.image_path, 'img', 'temp', fileHash);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const session: ChunkUploadSession = {
      fileHash,
      fileName,
      category,
      totalChunks,
      fileSize,
      uploadedChunks: new Set(),
      chunkPaths: new Map(),
      createdAt: new Date(),
    };

    this.uploadSessions.set(fileHash, session);

    return {
      fileHash,
      totalChunks,
      chunkSize,
      uploadId: fileHash,
    };
  }

  uploadChunk(chunk: File, chunkUploadDto: ChunkUploadDto) {
    const { fileHash } = chunkUploadDto;

    // Convertir les chaînes en nombres
    const chunkIndex = parseInt(chunkUploadDto.chunkIndex.toString(), 10);
    const totalChunks = parseInt(chunkUploadDto.totalChunks.toString(), 10);

    const session = this.uploadSessions.get(fileHash);
    if (!session) {
      throw new BadRequestException("Session d'upload non trouvée");
    }

    if (isNaN(chunkIndex) || isNaN(totalChunks)) {
      throw new BadRequestException('Index de chunk ou nombre total invalide');
    }

    if (chunkIndex >= totalChunks || chunkIndex < 0) {
      throw new BadRequestException('Index de chunk invalide');
    }

    if (session.uploadedChunks.has(chunkIndex)) {
      return { success: true, message: 'Chunk déjà uploadé' };
    }

    const tempDir = join(config.image_path, 'img', 'temp', fileHash);
    const chunkPath = join(tempDir, `chunk_${chunkIndex}`);

    // Sauvegarder le chunk
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    fs.writeFileSync(chunkPath, chunk.buffer);

    session.uploadedChunks.add(chunkIndex);
    session.chunkPaths.set(chunkIndex, chunkPath); // Utiliser l'index numérique comme clé

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

    if (session.uploadedChunks.size !== session.totalChunks) {
      throw new BadRequestException(
        `Tous les chunks ne sont pas uploadés: ${session.uploadedChunks.size}/${session.totalChunks}`,
      );
    }

    try {
      // Assembler les chunks
      const finalFileName = `${uuidv4()}.${session.fileName.split('.').pop()}`;
      const finalPath = join(config.image_path, 'img', category, finalFileName);

      // Créer le répertoire de destination si nécessaire
      const hikeDir = join(config.image_path, 'img', category);
      if (!fs.existsSync(hikeDir)) {
        fs.mkdirSync(hikeDir, { recursive: true });
      }

      // Assembler les chunks dans l'ordre
      const writeStream = fs.createWriteStream(finalPath);
      for (let i = 0; i < session.totalChunks; i++) {
        // Les clés peuvent être des chaînes, essayer les deux
        const chunkPath =
          session.chunkPaths.get(i) || session.chunkPaths.get(i.toString());

        if (!chunkPath || !fs.existsSync(chunkPath)) {
          throw new BadRequestException(`Chunk ${i} manquant`);
        }
        const chunkData = fs.readFileSync(chunkPath);
        writeStream.write(chunkData);
      }
      writeStream.end();

      // Attendre que l'écriture soit terminée
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve as () => void);
        writeStream.on('error', reject);
      });

      // Vérifier que le fichier final existe et sa taille
      if (!fs.existsSync(finalPath)) {
        throw new BadRequestException('Fichier final non créé');
      }

      // Vérifier que la taille du fichier correspond à la taille attendue
      const finalFileStats = fs.statSync(finalPath);
      if (finalFileStats.size !== session.fileSize) {
        console.error(
          `Taille du fichier incorrecte: attendu ${session.fileSize}, obtenu ${finalFileStats.size}`,
        );
        throw new BadRequestException(
          `Taille du fichier incorrecte: attendu ${session.fileSize}, obtenu ${finalFileStats.size}`,
        );
      }

      try {
        // Validation que le fichier est une image valide sans compression
        await sharp(finalPath).metadata();
      } catch (sharpError) {
        console.error('Erreur Sharp:', sharpError);
        throw new BadRequestException("Le fichier n'est pas une image valide");
      }

      // Obtenir le nombre d'images existantes pour l'ordre
      const numberMax = (await this.count({ where: { category } })) + 1;

      // Créer l'entrée en base de données
      const newImage = new Image();
      newImage.id = uuidv4();
      newImage.name = session.fileName ?? '';
      newImage.category = category;
      newImage.path = finalFileName;
      newImage.ordered = numberMax;

      const savedImage = await this.save(newImage);

      // Nettoyer les fichiers temporaires
      this.cleanupTempFiles(fileHash);
      this.uploadSessions.delete(fileHash);

      return savedImage;
    } catch (error) {
      // Nettoyer en cas d'erreur
      console.error('ERREUR lors de la finalisation:', error);
      console.error(
        'Stack trace:',
        error instanceof Error ? error.stack : 'N/A',
      );
      this.cleanupTempFiles(fileHash);
      this.uploadSessions.delete(fileHash);
      throw error;
    }
  }

  cancelChunkUpload(fileHash: string) {
    const session = this.uploadSessions.get(fileHash);
    if (!session) {
      // Session déjà supprimée, pas d'erreur
      return { success: true, message: 'Upload déjà annulé' };
    }

    this.cleanupTempFiles(fileHash);
    this.uploadSessions.delete(fileHash);

    return { success: true, message: 'Upload annulé' };
  }

  private cleanupTempFiles(fileHash: string) {
    const tempDir = join(config.image_path, 'img', 'temp', fileHash);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  private cleanupExpiredSessions() {
    const now = new Date();
    const expireTime = 24 * 60 * 60 * 1000; // 24 heures

    for (const [fileHash, session] of this.uploadSessions.entries()) {
      if (now.getTime() - session.createdAt.getTime() > expireTime) {
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
