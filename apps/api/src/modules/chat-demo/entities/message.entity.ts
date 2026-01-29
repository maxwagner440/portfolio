import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';

export type MessageSender = 'user' | 'support';

@Entity('chat_messages')
@Index(['conversationId'])
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conversationId: string;

  @ManyToOne(() => ConversationEntity, (conv) => conv.messages, {
    onDelete: 'CASCADE',
  })
  conversation: ConversationEntity;

  @Column({ type: 'text', enum: ['user', 'support'] })
  sender: MessageSender;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
