import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from '../middleware/AuthGuard';
import {
  CHUNK_LIMIT,
  ImageUpload,
  LEGACY_IMAGE_LIMITS,
} from '../repositories/image.repository';
import { isMissingFile } from '../services/image-variants';
import {
  ChunkStatusDto,
  ChunkUploadDto,
  CompleteUploadDto,
  InitiateUploadDto,
} from '../types/chunk.dto';
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
    return this.sendFile(res, await this.imageService.sendImage(id));
  }

  @Get(':id/blur')
  async sendImageBlur(@Param('id') id: string, @Res() res: Response) {
    return this.sendFile(res, await this.imageService.sendImageBlur(id));
  }

  @Get(':id/variant/v1/:width')
  async sendImageVariant(
    @Param('id') id: string,
    @Param('width') width: string,
    @Res() res: Response,
  ) {
    res.setHeader('X-Robots-Tag', 'noindex');
    res.setHeader('Cache-Control', 'no-store');
    const filename = await this.imageService.sendImageVariant(id, width);
    res.removeHeader('Cache-Control');
    await this.sendFile(res, filename, { immutable: true, maxAge: '365d' });
  }

  private sendFile(
    res: Response,
    filename: string,
    options: Parameters<Response['sendFile']>[1] = {},
  ) {
    return new Promise<void>((resolve, reject) => {
      res.sendFile(filename, options, (error) => {
        if (!error || res.headersSent || res.destroyed) return resolve();
        res.setHeader('Cache-Control', 'no-store');
        if (isMissingFile(error)) return reject(new NotFoundException());
        reject(error);
      });
    });
  }

  @UseGuards(AuthGuard)
  @Post(':pageId')
  @UseInterceptors(
    FilesInterceptor('images', LEGACY_IMAGE_LIMITS.files, {
      limits: LEGACY_IMAGE_LIMITS,
    }),
  )
  async create(
    @UploadedFiles() files: ImageUpload[],
    @Param('pageId') pageId: string,
  ) {
    return this.imageService.create(pageId, files);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateImageDto) {
    return this.imageService.update(id, updateDto);
  }

  @UseGuards(AuthGuard)
  @Put('reorder/:categoryId')
  async reorderImages(
    @Param('categoryId') categoryId: string,
    @Body() body: { imageIds: string[] },
  ) {
    await this.imageService.reorderImages(categoryId, body.imageIds);
    return { message: 'Images reordered successfully' };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.imageService.delete(id);
    return { message: 'Image deleted successfully' };
  }

  @Post('chunk/initiate')
  @UseGuards(AuthGuard)
  initiateChunkUpload(@Body() initiateUploadDto: InitiateUploadDto) {
    return this.imageService.initiateChunkUpload(initiateUploadDto);
  }

  @Post('chunk/upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('chunk', { limits: { fileSize: CHUNK_LIMIT } }),
  )
  uploadChunk(
    @UploadedFile() chunk: ImageUpload,
    @Body() chunkUploadDto: ChunkUploadDto,
  ) {
    return this.imageService.uploadChunk(chunk, chunkUploadDto);
  }

  @Get('chunk/status/:fileHash')
  @UseGuards(AuthGuard)
  getChunkStatus(@Param('fileHash') fileHash: string): ChunkStatusDto {
    return this.imageService.getChunkStatus(fileHash);
  }

  @Post('chunk/complete')
  @UseGuards(AuthGuard)
  async completeChunkUpload(@Body() completeUploadDto: CompleteUploadDto) {
    return this.imageService.completeChunkUpload(completeUploadDto);
  }

  @Delete('chunk/cancel/:fileHash')
  @UseGuards(AuthGuard)
  cancelChunkUpload(@Param('fileHash') fileHash: string) {
    return this.imageService.cancelChunkUpload(fileHash);
  }

  @Get('download/category/:categoryId')
  @UseGuards(AuthGuard)
  async downloadCategoryImages(
    @Param('categoryId') categoryId: string,
    @Res() res: Response,
  ) {
    try {
      const zipFilePath =
        await this.imageService.downloadCategoryImages(categoryId);

      // Définir les headers pour le téléchargement
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="category_${categoryId}.zip"`,
      );

      // Envoyer le fichier et nettoyer après
      res.sendFile(zipFilePath, (err) => {
        if (err) {
          console.error('Erreur lors du téléchargement:', err);
        }
        // Nettoyer le fichier temporaire après l'envoi
        this.imageService.cleanupZipFile(zipFilePath);
      });
    } catch (error) {
      console.error('Erreur lors de la création du ZIP:', error);
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'archive" });
    }
  }
}
