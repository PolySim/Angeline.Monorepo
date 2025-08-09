import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/middleware/AuthGuard';
import { CategoryService } from '../services/category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateCategoryOrderDto,
} from '../types';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get('active')
  async findActive() {
    return this.categoryService.findActive();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createDto: CreateCategoryDto) {
    return this.categoryService.create(createDto);
  }

  @UseGuards(AuthGuard)
  @Put('order')
  async updateOrder(@Body() orderedIds: UpdateCategoryOrderDto) {
    console.log(orderedIds);
    return this.categoryService.updateOrder(orderedIds);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id/toggle-disabled')
  async toggleDisabled(@Param('id') id: string) {
    return this.categoryService.toggleDisabled(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.categoryService.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
