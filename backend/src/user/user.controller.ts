import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FtAuthGuard } from '../auth/guards/guards';
import { Request } from 'express';

@Controller('users')
export class UserController {
	@Get('me')
	// @UseGuards(FtAuthGuard)
	getMe(@Req() request: Request) {
		console.log('users/me ', request.user);
		// return request.user;
		return [{"userid":"anruland","username":"Andreas","avatar":null,"twofa":0,"status":"0","created":"2022-12-31T12:33:41.171Z"}];
	}
}
