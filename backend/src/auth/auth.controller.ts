import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, FtAuthGuard } from './guards/guards';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
	constructor(private readonly config: ConfigService) {}

	@Get('return')
	@UseGuards(FtAuthGuard)
	ftAuthCallback(@Res() res, @Req() request: Request, @Session() session: Record<string, any>) {
		console.log('auth/return');
		// console.log('return', request);
		// console.log('session', session.passport.user.access_token);
		
		// console.log('response', res);
		// res.cookie('user', request);
		// res.setHeader('session', session.passport.user.userid);
		// console.log('response', request);
		res.redirect(`${this.config.get('FRONTEND_URL')}`);
		return request.user;
	}
	
	@Get('login')
	@UseGuards(FtAuthGuard)
	login() {
		console.log("auth/login");
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

	// @Get('logout')
	// logout (@Req() request: Request) {
	// 	console.log(request);
	// 	request.session.destroy();
	// 	console.log(request);
	// }

}
