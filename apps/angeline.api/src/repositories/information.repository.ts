import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Information } from '../entities/information.entity';
import { UpdateInformationDto } from '../types';

@Injectable()
export class InformationRepository extends Repository<Information> {
  constructor(private dataSource: DataSource) {
    super(Information, dataSource.createEntityManager());
  }

  async updateInformation(
    updateDto: UpdateInformationDto,
  ): Promise<Information | null> {
    const information = await this.findOne({ where: { lang: updateDto.lang } });
    if (!information) return null;

    information.name = updateDto.name || information.name;
    information.content = updateDto.content || information.content;
    await this.save(information);
    return information;
  }
}
