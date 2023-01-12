import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, FtAuthGuard } from './guards/guards';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
	constructor(private readonly config: ConfigService) {}

	@Get('return')
	@UseGuards(FtAuthGuard)
	ftAuthCallback(@Res() res, @Req() request: Request) {
		// console.log('return', request);
		// console.log(res);
		res.redirect(`${this.config.get('FRONTEND_URL')}`);
		return request.user;
	}
	
	@Get('login')
	@UseGuards(FtAuthGuard)
	login() {
		// console.log('Login function called');
		return { msg: 'logged in!'};
	}
	
	@Get('status')
	@UseGuards(AuthenticatedGuard)
	user(@Req() request: Request) {
		console.log(request.user);
		if (request.user)
			return { msg: "authenticated" };
		else 
			return { msg: "not authenticated" };
	}
}
