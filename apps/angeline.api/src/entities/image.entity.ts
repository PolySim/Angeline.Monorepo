import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('Image')
export class Image {
  @PrimaryColumn('text')
  id: string;

  @Column('text', { nullable: false })
  name: string;

  @Column('text', { nullable: false })
  path: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: false })
  category: string;

  @Column('integer', { nullable: false })
  ordered: number;

  @ManyToOne(() => Category, (category) => category.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category' })
  categoryRelation: Category;
}
