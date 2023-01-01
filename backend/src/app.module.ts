import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [ConfigModule.forRoot({
	isGlobal: true,
  }), 
  AuthModule, 
  UserModule, 
  DbModule, 
  PassportModule.register({ session: true })],
})
export class AppModule {}
