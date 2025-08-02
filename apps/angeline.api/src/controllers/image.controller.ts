import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { File } from 'multer';
import { ImageService } from '../services/image.service';
import { UpdateImageDto } from '../types';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.imageService.findByCategory(categoryId);
  }

  @Get(':id')
  async sendImage(@Param('id') id: string, @Res() res: Response) {
    return res.sendFile(await this.imageService.sendImage(id));
  }

  @Get(':id/blur')
  async sendImageBlur(@Param('id') id: string, @Res() res: Response) {
    return res.sendFile(await this.imageService.sendImageBlur(id));
  }

  @Post(':pageId')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles() files: File[],
    @Param('pageId') pageId: string,
  ) {
    return this.imageService.create(pageId, files);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateImageDto) {
    return this.imageService.update(id, updateDto);
  }

  @Put('reorder/:categoryId')
  async reorderImages(
    @Param('categoryId') categoryId: string,
    @Body() body: { imageIds: string[] },
  ) {
    await this.imageService.reorderImages(categoryId, body.imageIds);
    return { message: 'Images reordered successfully' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.imageService.delete(id);
    return { message: 'Image deleted successfully' };
  }
}
