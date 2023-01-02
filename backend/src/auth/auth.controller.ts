import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthDto } from './dto';
import { FtAuthGuard } from './guards/guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor() {}

	@Get('return')
	@UseGuards(FtAuthGuard)
	ftAuthCallback() {
		console.log("callback")
		return "Callback";
	}
	
	@Get('login')
	@UseGuards(FtAuthGuard)
	login() {
		console.log('Login function called');

	}

	@Get('status')
	user(@Req() request: Request) {
		console.log(request.user);
		if (request.user)
			return { msg: "authenticated" };
		else 
			return { msg: "not authenticated" };
	}
}