import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UpdateInformationDto } from 'src/types';
import { InformationService } from '../services/information.service';
import { AuthGuard } from 'src/middleware/AuthGuard';

@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Get()
  async findAll() {
    return this.informationService.findAll();
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() updateDto: UpdateInformationDto) {
    return this.informationService.update(updateDto);
  }
}
