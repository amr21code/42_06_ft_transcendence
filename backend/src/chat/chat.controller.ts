import { Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { UserService } from 'src/user/user.service';
import { Request, request } from 'express';
import { ChatMessageDto } from './dto';
import { ChatDto } from './dto/chat.dto';
import { ChatUserStatusDto } from './dto/chatuserstatus.dto';

@Controller('chat')
// @UseGuards(AuthenticatedGuard)
export class ChatController {
	constructor(private readonly chatService: ChatService, private readonly userService: UserService) {}

	@Get('list/chats/:userid?')
	async listChats(@Param('userid') userid?) {
		try {
			const list = await this.chatService.listChats(userid);
			return list;
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Get('join/:chatid?/:pw?')
	async joinChat(@Req() request: Request, @Param('chatid') chatid, @Param('pw') pw?) {
		if (!pw)
			pw = '';
		try {
			const user = await this.userService.getMe(request.user);
			const join = await this.chatService.joinChat(user[0].userid, chatid, pw);
			return join;
		} catch (error) {
			// console.log("error joining chat");
			throw new ForbiddenException();
		}
	}
	
	@Get('leave/:chatid')
	async leaveChat(@Req() request: Request, @Param('chatid') chatid) {
		try {
			const user = await this.userService.getMe(request.user);
			const leave = await this.chatService.leaveChat(user[0].userid, chatid);
			return (leave);
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Get('list/users/:chatid')
	async listUsers(@Param('chatid') chatid?)
	{
		try {
			const list = await this.chatService.listUsers(chatid);
			return list;
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Post('message')
	async newMessage(@Body() message: ChatMessageDto, @Req() request: Request) {
		try {
			// const user = await this.userService.getMe(request.user);
			// if (user[0].userid != message.userid)
			// 	throw new ForbiddenException();
			const msg = await this.chatService.addMessage(message);
			return msg;
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Get('list/messages/:chatid')
	async listMessages(@Req() request: Request, @Param('chatid') chatid) {
		try {
			const user = await this.userService.getMe(request.user);
			const list = await this.chatService.listMessages(user[0].userid, chatid);
			return list;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
	
	@Post('details')
	async changeChatDetails(@Body() details: ChatDto, @Req() request: Request) {
		try {
			const user = await this.userService.getMe(request.user);
			const userstatus = await this.chatService.getUserStatus(user[0].userid, details.chatid);
			if (userstatus[0].status != 0 || details.type > 2)
				throw new ForbiddenException();
			if (details.password != "" && details.type == 0)
				details.type = 1;
			else if (details.password == "" && details.type == 1)
				details.type = 0;
			const msg = await this.chatService.changeChatDetails(details);
			return msg;
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Post('user/status')
	async changeUserStatus(@Body() details: ChatUserStatusDto, @Req() request: Request) {
		// const user = await this.userService.getMe(request.user);
		// const userstatus = await this.chatService.getUserStatus(user[0].userid, details.chatid);
		// if (userstatus[0].status != 0)
		// 	throw new ForbiddenException();
		const result = await this.chatService.changeUserStatus(details);
		return {msg:"ok"};
	}

	// @Get('open/pm/:userid')
	// async openPM(@Req() request: Request, @Param('userid') userid) {
	// 	// try {
	// 		const user = await this.userService.getMe(request.user);
	// 		const joinresult = await this.chatService.joinChat(user[0].userid);
	// 		console.log("test3", joinresult);
	// 		const chatdetails = await this.chatService.createPMChatDto(user[0].userid, userid, joinresult);
	// 		console.log("test4");
	// 		const modchat = await this.chatService.changeChatDetails(chatdetails);
	// 		console.log("test5");
	// 		var details = await this.chatService.createPMUserDto(user[0].userid, joinresult);
	// 		console.log("test6");
	// 		var moduser = await this.chatService.changeUserStatus(details);
	// 		console.log("test7");
	// 		details.userid = userid;
	// 		console.log("test8");
	// 		moduser = await this.chatService.changeUserStatus(details);
	// 		console.log("test9");
		// } catch (error) {
		// 	throw new ForbiddenException();
		// }
	// }
}
