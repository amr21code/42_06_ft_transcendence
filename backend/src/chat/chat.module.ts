import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { ChatGateway } from './chat.gateway';
import { SessionSerializer } from 'src/auth/serializer';

@Module({
  controllers: [ChatController],
  providers: [ChatService, UserService, AuthService, ChatGateway, SessionSerializer, { provide: 'AUTH_SERVICE', useClass: AuthService }]
})
export class ChatModule {}
