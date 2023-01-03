import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/guards';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor( private readonly userService: UserService){}

	@Get('me')
	@UseGuards(AuthenticatedGuard)
	getMe(@Req() request: Request) {
		return request.user;
	}

	@Get(':userid')
	@UseGuards(AuthenticatedGuard)
	async getOne(@Param('userid') userid) {
		
		const users = await this.userService.getOne(userid);
		return users;
	}

	@Get('all')
	@UseGuards(AuthenticatedGuard)
	async getAll() {
		const users = await this.userService.getAll();
		return users;
	}
}
