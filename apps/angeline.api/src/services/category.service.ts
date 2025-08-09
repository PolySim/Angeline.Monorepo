import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateCategoryOrderDto,
} from '../types';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { ordered: 'ASC' } });
  }

  async findActive(): Promise<Category[]> {
    return this.categoryRepository.findActive();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(createDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.createCategory(createDto);
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.updateCategory(
      id,
      updateDto,
    );
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async toggleDisabled(id: string): Promise<Category> {
    const category = await this.categoryRepository.toggleDisabled(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateOrder(orderedIds: UpdateCategoryOrderDto): Promise<Category[]> {
    return this.categoryRepository.updateOrder(orderedIds);
  }

  async delete(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
