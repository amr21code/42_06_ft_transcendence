import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, FtAuthGuard } from './guards/guards';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
	constructor(private readonly config: ConfigService) {}

	@UseGuards(FtAuthGuard)
	@Get('return')
	ftAuthCallback(@Req() request: Request) {
		// console.log('return', request.user);
		return request.user;
	}
	
	@UseGuards(FtAuthGuard)
	@Get('login')
	login(@Res() res) {
		// console.log('Login function called');
		// return { msg: 'logged in!'};
		res.redirect(`${this.config.get('FRONTEND_URL')}`);
	}
	
	@UseGuards(AuthenticatedGuard)
	@Get('status')
	user(@Req() request: Request) {
		console.log(request.user);
		if (request.user)
			return { msg: "authenticated" };
		else 
			return { msg: "not authenticated" };
	}
}
