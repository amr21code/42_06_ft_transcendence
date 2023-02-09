import { Controller, ForbiddenException, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { FtAuthGuard } from './guards/guards';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly config: ConfigService, private readonly userService: UserService) {}

	@Get('return')
	@UseGuards(FtAuthGuard)
	ftAuthCallback(@Res() res, @Req() request: Request, @Session() session: Record<string, any>) {
		// console.log('auth/return');
		try {
			res.redirect(`${this.config.get('FRONTEND_URL')}`);
			return request.user;
		} catch (error) {
			throw new ForbiddenException('auth status');
		}
	}
	
	@Get('login')
	@UseGuards(FtAuthGuard)
	login() {
		// console.log("auth/login");
		return { msg: 'logged in!'};
	}
	
	@Get('status')
	user(@Req() request: Request, @Session() session: Record<string, any>) {
		try {
			if (request.user)
				if (session.passport.user.twofa == 1) {
					if (session.passport.user.twofalogin == 1) {
						return { msg: "authenticated" };
					} else {
						return { msg: "2fa" };
					}
				} else {
					return { msg: "authenticated" };
				}
			else
				return { msg: "not authenticated" };
		} catch (error) {
			throw new ForbiddenException('auth status');
		}
	}
}
