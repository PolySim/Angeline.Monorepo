import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../types';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async findActive(): Promise<Category[]> {
    return this.find({
      where: { disabled: false },
      order: { ordered: 'ASC' },
    });
  }

  async createCategory(createDto: CreateCategoryDto): Promise<Category> {
    const category = this.create({
      id: uuidv4(),
      disabled: false,
      ...createDto,
    });
    category.disabled = false;
    const maxOrdered = await this.find({
      select: { ordered: true },
      order: { ordered: 'DESC' },
    });
    category.ordered = maxOrdered[0].ordered + 1;
    const saved = await this.save(category);
    return saved as unknown as Category;
  }

  async updateCategory(
    id: string,
    updateDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    await this.update(id, updateDto);
    return this.findOne({ where: { id } });
  }

  async toggleDisabled(id: string): Promise<Category | null> {
    const category = await this.findOne({ where: { id } });
    if (category) {
      category.disabled = !category.disabled;
      return this.save(category);
    }
    return null;
  }
}
