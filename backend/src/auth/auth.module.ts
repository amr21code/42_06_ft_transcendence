import { Controller, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtStrategy } from './strategy/ft.strategy';
import { SessionSerializer } from './serializer';

@Module({
	controllers: [AuthController],
	providers: [{ provide: 'AUTH_SERVICE', useClass: AuthService }, FtStrategy, SessionSerializer
	],
})
export class AuthModule {}

