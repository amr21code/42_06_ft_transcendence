import { Controller, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtStrategy } from './strategy/ft.strategy';
import { SessionSerializer } from './serializer';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TwoFactorAuthenticationService } from './twoFactorAuth.service';
import { TwoFactorAuthenticationController } from './twoFactorAuth.controller';

@Module({
	imports: [UserModule, PassportModule.register({session: true})],
	controllers: [AuthController, TwoFactorAuthenticationController],
	providers: [{ provide: 'AUTH_SERVICE', useClass: AuthService }, 
	FtStrategy,
	AuthService,
	TwoFactorAuthenticationService,
	SessionSerializer,
	UserService,
	],
})
export class AuthModule {}

