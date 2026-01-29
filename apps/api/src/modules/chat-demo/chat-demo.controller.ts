import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ChatDemoService } from './chat-demo.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesQueryDto } from './dto/messages-query.dto';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';

@Controller('demo/chat')
export class ChatDemoController {
  constructor(private readonly chatDemoService: ChatDemoService) {}

  @Get('conversations')
  getConversations(): Promise<ConversationEntity[]> {
    return this.chatDemoService.getConversations();
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Param('id') id: string,
    @Query() query: MessagesQueryDto,
  ): Promise<MessageEntity[]> {
    return this.chatDemoService.getConversationMessages(id, query);
  }

  @Post('conversations/:id/messages')
  async createMessage(
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ): Promise<MessageEntity> {
    const message = await this.chatDemoService.createMessage(id, dto);
    if (!message) {
      throw new NotFoundException('Conversation not found');
    }
    return message;
  }
}
