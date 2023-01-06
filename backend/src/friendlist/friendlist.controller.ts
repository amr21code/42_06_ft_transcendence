// import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
// import { Request } from 'express';
// import { AuthenticatedGuard } from 'src/auth/guards/guards';
// import { FriendlistService } from './friendlist.service';

// @Controller('fl')
// // @UseGuards(AuthenticatedGuard)
// export class FriendlistController {
// 	constructor(private readonly flservice: FriendlistService) {}

// 	@Get('bash')
// 	async showFL(@Req() request: Request, @Param('userid') userid?){
// 		if (!userid)
// 			userid = request.user[0].userid;
// 		console.log('FL of User', userid);
// 		const fl = await this.flservice.showFL(userid);
// 		return fl;
// 	}
// 	// requestFriend
// 	// confirmFriend
// 	// removeFriend
// 	// blockUser
// 	// unblockUser
// }
