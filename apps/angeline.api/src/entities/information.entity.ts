import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Information')
export class Information {
  @PrimaryColumn('text')
  id: string;

  @Column('text', { nullable: false })
  name: string;

  @Column('text', { default: '' })
  content: string;

  @Column('text', { nullable: false })
  lang: string;
}
