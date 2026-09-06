import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Image } from '../entities/image.entity';
import { CategoryRepository } from './category.repository';

describe('CategoryRepository creation', () => {
  let dataSource: DataSource;
  let repository: CategoryRepository;

  beforeEach(async () => {
    dataSource = await new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [Category, Image],
      synchronize: true,
    }).initialize();
    repository = new CategoryRepository(dataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('creates the first reportage without taking a permanent section slot', async () => {
    const category = await repository.createCategory({
      name: 'Premier reportage',
      article: '',
    });
    expect(category.ordered).toBe(4);
    expect(category.id).toBeTruthy();
  });

  it('appends subsequent reportages after the last existing position', async () => {
    await repository.createCategory({ name: 'Premier', article: '' });
    const category = await repository.createCategory({
      name: 'Deuxième',
      article: '',
    });
    expect(category.ordered).toBe(5);
  });
});
