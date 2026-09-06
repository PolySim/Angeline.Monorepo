import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/config';
import {
  CategoryController,
  HomepageSettingsController,
  ImageController,
  InformationController,
} from './controllers';
import { DatabaseService } from './db/database.service';
import { Category, HomepageSettings, Image, Information } from './entities';
import {
  CategoryRepository,
  HomepageSettingsRepository,
  ImageRepository,
  InformationRepository,
} from './repositories';
import {
  CategoryService,
  HomepageSettingsService,
  ImageService,
  InformationService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: config.database_path,
      entities: [Information, HomepageSettings, Category, Image],
      synchronize: false,
      logging: false,
    }),
    TypeOrmModule.forFeature([Information, HomepageSettings, Category, Image]),
  ],
  controllers: [
    AppController,
    InformationController,
    HomepageSettingsController,
    CategoryController,
    ImageController,
  ],
  providers: [
    AppService,
    DatabaseService,
    InformationRepository,
    HomepageSettingsRepository,
    CategoryRepository,
    ImageRepository,
    InformationService,
    HomepageSettingsService,
    CategoryService,
    ImageService,
  ],
})
export class AppModule {}
