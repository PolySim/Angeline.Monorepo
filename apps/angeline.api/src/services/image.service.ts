import { Injectable, NotFoundException } from '@nestjs/common';
import { File } from 'multer';
import { ImageRepository } from '../repositories/image.repository';
import { Image, UpdateImageDto } from '../types';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async findById(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }
  async findByCategory(categoryId: string): Promise<Image[]> {
    return this.imageRepository.findByCategory(categoryId);
  }

  async sendImage(id: string): Promise<string> {
    return this.imageRepository.sendImage(id);
  }

  async sendImageBlur(id: string): Promise<string> {
    return this.imageRepository.sendImageBlur(id);
  }

  async create(pageId: string, files: File[]): Promise<Image[]> {
    return this.imageRepository.createImage(pageId, files);
  }

  async update(id: string, updateDto: UpdateImageDto): Promise<Image> {
    const image = await this.imageRepository.updateImage(id, updateDto);
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async reorderImages(categoryId: string, imageIds: string[]): Promise<void> {
    await this.imageRepository.reorderImages(categoryId, imageIds);
  }

  async delete(id: string): Promise<void> {
    const result = await this.imageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
  }
}
