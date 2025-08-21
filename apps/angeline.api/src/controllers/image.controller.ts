import {
  Body,
  Controller,
  Delete,
  Get,
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
import { File } from 'multer';
import { AuthGuard } from 'src/middleware/AuthGuard';
import {
  ChunkStatusDto,
  ChunkUploadDto,
  CompleteUploadDto,
  InitiateUploadDto,
} from 'src/types/chunk.dto';
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

  @UseGuards(AuthGuard)
  @Post(':pageId')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles() files: File[],
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
  @UseInterceptors(FileInterceptor('chunk'))
  uploadChunk(
    @UploadedFile() chunk: File,
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
}
