import { Controller, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtStrategy } from './strategy/ft.strategy';
import { SessionSerializer } from './serializer';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
	imports: [UserModule, PassportModule.register({session: true})],
	controllers: [AuthController],
	providers: [{ provide: 'AUTH_SERVICE', useClass: AuthService }, 
	FtStrategy, 
	SessionSerializer,
	UserService,
	],
})
export class AuthModule {}

