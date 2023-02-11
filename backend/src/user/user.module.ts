import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { UserGateway } from './user.gateway';
import { sessionMiddleware } from 'src/middleware';
import { AchievementsService } from 'src/achievements/achievements.service';
import { MatchService } from 'src/match/match.service';
import { TwoFactorAuthenticationService } from 'src/auth/twoFactorAuth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, UserGateway, AchievementsService, MatchService, TwoFactorAuthenticationService]
})
export class UserModule {
	configure(consumer: MiddlewareConsumer){
	  consumer.apply(sessionMiddleware).forRoutes('user');
	};
  }