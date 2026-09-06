import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HomepageSettings } from '../entities/homepage-settings.entity';
import { UpdateHomepageSettingsDto } from '../types';

export const HOMEPAGE_SETTINGS_ID = 'homepage';

@Injectable()
export class HomepageSettingsRepository extends Repository<HomepageSettings> {
  constructor(private dataSource: DataSource) {
    super(HomepageSettings, dataSource.createEntityManager());
  }

  async findSettings(): Promise<HomepageSettings> {
    const settings = await this.findOne({
      where: { id: HOMEPAGE_SETTINGS_ID },
    });

    if (settings) return settings;

    return this.save(
      this.create({
        id: HOMEPAGE_SETTINGS_ID,
        visible: false,
        title:
          'Angeline Desdevises, photographe documentaire et photojournaliste',
        content:
          'Travail documentaire autour des conflits, des territoires et des récits humains, avec une attention particulière portée au Moyen-Orient, à la Syrie, au Liban, aux portraits et aux publications de presse.',
      }),
    );
  }

  async updateSettings(
    updateDto: UpdateHomepageSettingsDto,
  ): Promise<HomepageSettings> {
    const settings = await this.findSettings();

    if (updateDto.visible !== undefined) {
      settings.visible = updateDto.visible;
    }
    if (updateDto.title !== undefined) {
      settings.title = updateDto.title;
    }
    if (updateDto.content !== undefined) {
      settings.content = updateDto.content;
    }

    return this.save(settings);
  }
}
