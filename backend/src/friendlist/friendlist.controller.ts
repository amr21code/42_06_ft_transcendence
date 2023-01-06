import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/auth/guards/guards';

@Controller('fl')
@UseGuards(AuthenticatedGuard)
export class FriendlistController {
	constructor() {}

	@Get('show')
	showFL(@Req() request: Request){
		console.log('Request', request.user[0].userid);
	}
}
