import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('HomepageSettings')
export class HomepageSettings {
  @PrimaryColumn('text')
  id: string;

  @Column('boolean', { default: false })
  visible: boolean;

  @Column('text', { default: '' })
  title: string;

  @Column('text', { default: '' })
  content: string;
}
