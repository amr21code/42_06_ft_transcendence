import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
	isGlobal: true,
  }), AuthModule, UserModule, DbModule],
})
export class AppModule {}
