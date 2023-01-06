import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { FriendlistModule } from './friendlist/friendlist.module';

@Module({
  imports: [ConfigModule.forRoot({
	isGlobal: true,
  }), 
  AuthModule, 
  UserModule, 
  DbModule, 
  PassportModule.register({ session: true }), FriendlistModule],
})
export class AppModule {}
