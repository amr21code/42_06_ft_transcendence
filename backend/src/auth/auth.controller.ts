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
		return {msg: "OK"} ;
	}
	
	@Get('login')
	@UseGuards(FtAuthGuard)
	login(@Body() dto: AuthDto) {
		console.log({
			dto: dto,
		});
		// return this.authService.login(dto);
	}

	@Get('status')
	user(@Req() request: Request) {
		console.log(request.user);
		if (request.user)
			return { msg: "authenticated" };
		else 
			return { msg: "not" };
	}
	// @Get('logout')
	// logOut(@Req() req: Request) {
	//   req.logOut();
	// }

	// @Post('signup')
	// signup(@Body() dto: AuthDto) {
	// 	return this.authService.signup(dto);
	// }

	// @Post('login')
	// login(@Body() dto: AuthDto) {
	// 	console.log({
	// 		dto: dto,
	// 	});
	// 	return this.authService.login(dto);
	// }
	
}