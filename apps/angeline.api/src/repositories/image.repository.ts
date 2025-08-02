/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { File } from 'multer';
import * as fs from 'node:fs';
import sharp from 'sharp';
import { config } from 'src/config/config';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Image } from '../entities/image.entity';
import { UpdateImageDto } from '../types';

@Injectable()
export class ImageRepository extends Repository<Image> {
  constructor(private dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
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

    await sharp(file.buffer).toFile(name);
  }
}
