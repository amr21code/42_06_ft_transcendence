import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FtAuthGuard } from '../auth/guards/guards';
import { Request } from 'express';

@Controller('users')
export class UserController {
	@Get('me')
	// @UseGuards(FtAuthGuard)
	getMe(@Req() request: Request) {
		console.log('users/me ', request.user);
		return request.user;
	}
}
