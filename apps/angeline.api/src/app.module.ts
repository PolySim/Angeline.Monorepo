import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/config';
import {
  CategoryController,
  ImageController,
  InformationController,
} from './controllers';
import { DatabaseService } from './db/database.service';
import { Category, Image, Information } from './entities';
import {
  CategoryRepository,
  ImageRepository,
  InformationRepository,
} from './repositories';
import { CategoryService, ImageService, InformationService } from './services';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: config.database_path,
      entities: [Information, Category, Image],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([Information, Category, Image]),
  ],
  controllers: [
    AppController,
    InformationController,
    CategoryController,
    ImageController,
  ],
  providers: [
    AppService,
    DatabaseService,
    InformationRepository,
    CategoryRepository,
    ImageRepository,
    InformationService,
    CategoryService,
    ImageService,
  ],
})
export class AppModule {}
