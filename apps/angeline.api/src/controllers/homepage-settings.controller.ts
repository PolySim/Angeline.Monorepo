import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../middleware/AuthGuard';
import { HomepageSettingsService } from '../services/homepage-settings.service';
import { UpdateHomepageSettingsDto } from '../types';

@Controller('homepage-settings')
export class HomepageSettingsController {
  constructor(
    private readonly homepageSettingsService: HomepageSettingsService,
  ) {}

  @Get()
  async find() {
    return this.homepageSettingsService.find();
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() updateDto: UpdateHomepageSettingsDto) {
    return this.homepageSettingsService.update(updateDto);
  }
}
