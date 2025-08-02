import { Injectable, NotFoundException } from '@nestjs/common';
import { Information as InformationEntity } from 'src/entities/information.entity';
import { InformationRepository } from '../repositories/information.repository';
import { Information, UpdateInformationDto } from '../types';

@Injectable()
export class InformationService {
  constructor(private readonly informationRepository: InformationRepository) {}

  async findAll(): Promise<any[]> {
    return this.informationRepository.find();
  }

  async update(updateDto: UpdateInformationDto): Promise<Information> {
    const information =
      await this.informationRepository.updateInformation(updateDto);
    if (!information) {
      throw new NotFoundException(
        `Information with ID ${updateDto.id} not found`,
      );
    }
    return information || new InformationEntity();
  }
}
