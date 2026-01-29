import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { ChatDemoController } from './chat-demo.controller';
import { ChatDemoService } from './chat-demo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity]),
  ],
  controllers: [ChatDemoController],
  providers: [ChatDemoService],
})
export class ChatDemoModule {}
