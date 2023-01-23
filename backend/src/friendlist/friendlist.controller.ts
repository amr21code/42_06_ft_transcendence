import { Controller, ForbiddenException, Get, Param, Req, Session, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from '../auth/guards/guards';
import { FriendlistService } from './friendlist.service';
import { UserService } from '../user/user.service';

@Controller('fl')
@UseGuards(AuthenticatedGuard)
export class FriendlistController {
	constructor(private readonly flservice: FriendlistService, private readonly userService: UserService) {}

	@Get('show/:userid?')
	async showFL(@Session() session: Record<string, any>, @Param('userid') userid?){
		if (!userid)
			userid = session.passport.user.userid;
		const fl = await this.flservice.showFL(userid);
		return fl;
	}
	
	@Get('edit/:userid/:action')
	async changeStatus(@Req() request: Request, @Param('userid') userid_other, @Param('action') action)
	{
		const user = await this.userService.getMe(request.user);
		try {
			if (user[0].userid === userid_other)
				throw new ForbiddenException();
			const status = await this.flservice.changeStatus(user[0].userid, userid_other, action);
				return { msg : "ok" };
		} catch (error) {
			throw new ForbiddenException('invalid change request');
		}
	}
}
