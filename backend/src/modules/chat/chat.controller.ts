import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayNotEmpty, IsArray, IsIn, IsNotEmpty, IsString, MaxLength, ValidateNested,
} from 'class-validator';
import { ChatService } from './chat.service';

export class ChatMessageDto {
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  @IsNotEmpty()
  @MaxLength(6000)
  content: string;
}

export class ChatRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Endpoint caro (consume tokens de Groq): limite estricto por IP
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post()
  async chat(@Body() body: ChatRequestDto) {
    return this.chatService.chat(body.messages);
  }
}
