import { Body, Controller, Get, Put } from '@nestjs/common';
import { InformationService } from '../services/information.service';
import { UpdateInformationDto } from 'src/types';

@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Get()
  async findAll() {
    return this.informationService.findAll();
  }

  @Put()
  async update(@Body() updateDto: UpdateInformationDto) {
    return this.informationService.update(updateDto);
  }
}
