import { Controller, ForbiddenException, Get, Param,  Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard} from '../auth/guards/guards';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UserController {
	constructor(private readonly userService: UserService){}

	@Get('me')
	async getMe(@Req() request: Request) {
		const user = await this.userService.getMe(request.user);
		return user;
	}

	@Get('all')
	async getAll() {
		const users = await this.userService.getAll();
		return users;
	}

	@Get(':userid')
	async getOne(@Param('userid') userid) {
		const users = await this.userService.getOne(userid);
		return users;
	}
	
	@Get(':userid/:field/:new')
	async changeUserData(@Req() request: Request, @Param('userid') userid, @Param('field') field, @Param('new') newdata) {
		const user = request.session.passport.user.userid;
		// const user = await this.getMe(request);
		try {
				if (userid != user)
					throw new ForbiddenException();
				const status = await this.userService.changeUserData(userid, field, newdata);
					return { msg : "ok" };
			} catch (error) {
				throw new ForbiddenException('invalid userstatus');
			}
		}
		
		@Get(':userid/:field')
		async getUserData(@Req() request: Request, @Param('userid') userid, @Param('field') field) {
		const user = request.session.passport.user.userid;
		// const user = await this.getMe(request);
		try {
				if (userid != user)
					throw new ForbiddenException();
				const status = await this.userService.getUserData(userid, field);
					return { msg : "ok" };
			} catch (error) {
				throw new ForbiddenException('invalid userstatus');
			}
	}
	

}
