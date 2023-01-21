import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { UserGateway } from './user.gateway';
import { sessionMiddleware } from 'src/middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, UserGateway]
})
export class UserModule {
	configure(consumer: MiddlewareConsumer){
	  consumer.apply(sessionMiddleware).forRoutes('user');
	};
  }