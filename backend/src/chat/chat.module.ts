import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, UserService]
})
export class ChatModule {}
