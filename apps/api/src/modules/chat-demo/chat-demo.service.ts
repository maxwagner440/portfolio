import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesQueryDto } from './dto/messages-query.dto';

const CONVERSATION_TITLES = [
  'Billing inquiry',
  'Technical support',
  'Feature request',
  'Account access',
  'API integration',
  'Bug report',
  'General question',
  'Onboarding help',
  'Subscription change',
  'Documentation',
];

const MESSAGE_BODIES = [
  'Hello, how can I help you today?',
  'Thanks for reaching out.',
  'Let me look into that for you.',
  'I have updated your account.',
  'Can you provide more details?',
  'The issue has been resolved.',
  'Is there anything else you need?',
  'We have received your request.',
  'I will escalate this to the team.',
  'Here are the next steps.',
  'Thank you for your patience.',
  'Please try again in a few minutes.',
  'Your ticket has been created.',
  'I have forwarded this to support.',
  'You should see the change shortly.',
];

@Injectable()
export class ChatDemoService implements OnModuleInit {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepo: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.conversationRepo.count();
    if (count === 0) {
      await this.seed();
    }
  }

  async getConversations(): Promise<ConversationEntity[]> {
    return this.conversationRepo.find({
      order: { updatedAt: 'DESC' },
    });
  }

  async getConversationMessages(
    conversationId: string,
    query: MessagesQueryDto,
  ): Promise<MessageEntity[]> {
    const limit = query.limit ?? 30;
    const qb = this.messageRepo
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .orderBy('message.createdAt', 'DESC')
      .take(limit);

    if (query.before) {
      qb.andWhere('message.createdAt < :before', {
        before: new Date(query.before),
      });
    }

    const messages = await qb.getMany();
    return messages.reverse();
  }

  async createMessage(
    conversationId: string,
    dto: CreateMessageDto,
  ): Promise<MessageEntity | null> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conversation) {
      return null;
    }
    const message = this.messageRepo.create({
      conversationId,
      sender: dto.sender,
      body: dto.body,
    });
    const saved = await this.messageRepo.save(message);
    conversation.updatedAt = new Date();
    await this.conversationRepo.save(conversation);
    return saved;
  }

  private async seed() {
    for (let c = 0; c < 10; c++) {
      const conv = this.conversationRepo.create({
        title: CONVERSATION_TITLES[c] ?? `Conversation ${c + 1}`,
      });
      const savedConv = await this.conversationRepo.save(conv);
      const numMessages = 50 + Math.floor(Math.random() * 151);
      let lastCreatedAt: Date = savedConv.createdAt;
      for (let m = 0; m < numMessages; m++) {
        const sender = m % 2 === 0 ? 'user' : 'support';
        const body =
          MESSAGE_BODIES[Math.floor(Math.random() * MESSAGE_BODIES.length)];
        const msg = this.messageRepo.create({
          conversationId: savedConv.id,
          sender,
          body,
        });
        const savedMsg = await this.messageRepo.save(msg);
        lastCreatedAt = savedMsg.createdAt;
      }
      await this.conversationRepo.update(savedConv.id, {
        updatedAt: lastCreatedAt,
      });
    }
  }
}
