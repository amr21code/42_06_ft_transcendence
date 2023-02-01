import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { FriendlistModule } from './friendlist/friendlist.module';
import { AchievementsModule } from './achievements/achievements.module';
import { ChatModule } from './chat/chat.module';
import { MatchModule } from './match/match.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ConfigModule.forRoot({
	isGlobal: true,
  }), 
  AuthModule, 
  UserModule, 
  DbModule, 
  PassportModule.register({ session: true }), 
  FriendlistModule, 
  AchievementsModule, 
  ChatModule, 
  MatchModule,
  MulterModule.register({dest: '../uploads'})],
})
export class AppModule {}
