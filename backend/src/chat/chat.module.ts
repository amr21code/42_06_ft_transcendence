import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { ChatGateway } from './chat.gateway';
import { sessionMiddleware } from 'src/middleware';

@Module({
  controllers: [ChatController],
  providers: [ChatService, UserService, AuthService, ChatGateway]
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(sessionMiddleware).forRoutes('chat');
  };
}