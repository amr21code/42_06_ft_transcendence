import { Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { UserService } from 'src/user/user.service';
import { Request, request } from 'express';
import { ChatMessageDto } from './dto';

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
			// if (request[0].userid != message.userid)
			// 	throw new ForbiddenException();
			const msg = await this.chatService.addMessage(message);
			return msg;
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Get('list/messages/:chatid')
	async listMessages(@Param('chatid') chatid) {
		try {
			const list = await this.chatService.listMessages(chatid);
			return list;
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
