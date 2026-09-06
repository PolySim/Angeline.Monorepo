import { Injectable } from '@nestjs/common';
import { HomepageSettings } from '../entities/homepage-settings.entity';
import { HomepageSettingsRepository } from '../repositories/homepage-settings.repository';
import { UpdateHomepageSettingsDto } from '../types';

@Injectable()
export class HomepageSettingsService {
  constructor(
    private readonly homepageSettingsRepository: HomepageSettingsRepository,
  ) {}

  async find(): Promise<HomepageSettings> {
    return this.homepageSettingsRepository.findSettings();
  }

  async update(
    updateDto: UpdateHomepageSettingsDto,
  ): Promise<HomepageSettings> {
    return this.homepageSettingsRepository.updateSettings(updateDto);
  }
}
