import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, FtAuthGuard } from './guards/guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor() {}

	@UseGuards(FtAuthGuard)
	@Get('return')
	ftAuthCallback(@Req() request: Request) {
		console.log('return', request.user);
		return request.user;
	}
	
	@UseGuards(FtAuthGuard)
	@Get('login')
	login() {
		console.log('Login function called');
		return { msg: 'logged in!'};
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
