import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, UserService, AuthService]
})
export class ChatModule {}
