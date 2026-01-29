import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('search_items')
@Index(['title'])
@Index(['type'])
@Index(['status'])
export class SearchItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'text', nullable: true })
  city: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
