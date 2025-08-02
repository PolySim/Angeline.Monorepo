import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Image } from './image.entity';

@Entity('Category')
export class Category {
  @PrimaryColumn('text')
  id: string;

  @Column('text', { nullable: false })
  name: string;

  @Column('text', { nullable: true })
  article: string;

  @Column('integer', { nullable: false })
  ordered: number;

  @Column('boolean', { default: false })
  disabled: boolean;

  @OneToMany(() => Image, (image) => image.categoryRelation)
  images: Image[];
}
