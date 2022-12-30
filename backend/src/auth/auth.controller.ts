import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { FtAuthGuard } from './guards/guards';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

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
		return this.authService.login(dto);
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