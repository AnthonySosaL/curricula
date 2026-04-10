import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

export class ChatMessageDto {
  role: 'user' | 'assistant';
  content: string;
}

export class ChatRequestDto {
  messages: ChatMessageDto[];
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatRequestDto) {
    return this.chatService.chat(body.messages);
  }
}
