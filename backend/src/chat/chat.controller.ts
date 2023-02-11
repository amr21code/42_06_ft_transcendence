import { Body, Controller, ForbiddenException, Get, Param, Post, Req, Session, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { ChatMessageDto } from './dto';
import { ChatDto } from './dto/chat.dto';
import { ChatUserStatusDto } from './dto/chatuserstatus.dto';

@Controller('chat')
@UseGuards(AuthenticatedGuard)
export class ChatController {
	constructor(private readonly chatService: ChatService, private readonly userService: UserService) {}

	@Get('list/chats')
	async listChats(@Session() session: Record<string, any>) {
		try {
			const user = session.passport.user.userid;
			const list = await this.chatService.listChats(user);
			return list;
		} catch (error) {
			throw new ForbiddenException('list chats');
		}
	}

	@Get('list/userchats')
	async listUserChats(@Session() session: Record<string, any>) {
		try {
			const user = session.passport.user.userid;
			const list = await this.chatService.listUserChats(user);
			return list;
		} catch (error) {
			throw new ForbiddenException('list user chats');
		}
	}

	@Get('join/:chatid/:pw?')
	async joinChat(@Req() request: Request, @Param('chatid') chatid, @Param('pw') pw?) {
		if (!pw)
			pw = '';
		try {
			const user = request.session.passport.user.userid;
			const join = await this.chatService.joinChat(user, chatid, pw);
			return join;
		} catch (error) {
			throw new ForbiddenException('join chat');
		}
	}

	@Post('create')
	async createChat(@Body() details: ChatDto, @Session() session: Record<string, any>) {
		try {
			const user = session.passport.user.userid;
			if (details.password != "" && details.type == 0)
				details.type = 1;
			else if (details.password == "" && details.type == 1)
				details.type = 0;
			const join = await this.chatService.joinChat(user);
			details.chatid = join;
			const msg = await this.chatService.changeChatDetails(details);
			return { "msg" : "ok" };
		} catch (error) {
			throw new ForbiddenException('create chat');
		}
	}
	
	@Get('leave/:chatid')
	async leaveChat(@Req() request: Request, @Param('chatid') chatid) {
		try {
			const user = request.session.passport.user.userid;
			const leave = await this.chatService.leaveChat(user, chatid);
			return (leave);
		} catch (error) {
			throw new ForbiddenException('leave chat');
		}
	}

	@Get('list/users/:chatid')
	async listUsers(@Param('chatid') chatid?)
	{
		try {
			const list = await this.chatService.listUsers(chatid);
			return list;
		} catch (error) {
			throw new ForbiddenException('list users of chat');
		}
	}

	@Post('message')
	async newMessage(@Body() message: ChatMessageDto, @Req() request: Request) {
		try {
			const user = request.session.passport.user.userid;
			if (user != message.userid)
				throw new ForbiddenException();
			const msg = await this.chatService.addMessage(message);
			return msg;
		} catch (error) {
			throw new ForbiddenException('new message');
		}
	}

	@Get('list/messages/:chatid')
	async listMessages(@Req() request: Request, @Param('chatid') chatid) {
		try {
			const user = request.session.passport.user.userid;
			const list = await this.chatService.listMessages(user, chatid);
			return list;
		} catch (error) {
			throw new ForbiddenException('list messages chat');
		}
	}
	
	@Post('details')
	async changeChatDetails(@Body() details: ChatDto, @Req() request: Request) {
		try {
			const user = request.session.passport.user.userid;
			const userstatus = await this.chatService.getUserStatus(user, details.chatid);
			if (userstatus[0].status != 0 || details.type > 2)
				throw new ForbiddenException();
			if (details.password != "" && details.type == 0)
				details.type = 1;
			else if (details.password == "" && details.type == 1)
				details.type = 0;
			const msg = await this.chatService.changeChatDetails(details);
			return msg;
		} catch (error) {
			throw new ForbiddenException('change chat details');
		}
	}

	@Post('user/status')
	async changeUserStatus(@Body() details: ChatUserStatusDto, @Req() request: Request) {
		try {
			const user = request.session.passport.user.userid;
			const userstatus = await this.chatService.getUserStatus(user, details.chatid);
			if (userstatus[0].status > 1)
				throw new ForbiddenException();
			const result = await this.chatService.changeUserStatus(details);
			return {msg:"ok"};
		} catch (error) {
			throw new ForbiddenException('change user status');
		}
	}

	@Get('open/pm/:userid')
	async openPM(@Req() request: Request, @Param('userid') userid) {
		try {
			const user1 = request.session.passport.user.userid;
			const user2 = await this.userService.getOne(userid);
			const statuscode = await this.userService.showUserRelationshipStatus(user1, user2[0].userid);
			if (Object.keys(statuscode).length == 0 || (Object.keys(statuscode).length == 1 && statuscode[0].statuscode != 2)) {
				await this.chatService.checkPMChat(user1, user2[0].userid);
				const joinresult = await this.chatService.joinChat(user1);
				const chatdetails = await this.chatService.createPMChatDto(user1, user2[0].userid, joinresult);
				const modchat = await this.chatService.changeChatDetails(chatdetails);
				var details = await this.chatService.createPMUserDto(user1, joinresult);
				var moduser = await this.chatService.changeUserStatus(details);
				details.userid = user2[0].userid;
				moduser = await this.chatService.changeUserStatus(details);
				return {'msg': 'ok'};
			} else {
				throw new ForbiddenException();
			}
		} catch (error) {
			throw new ForbiddenException('open pm');
		}
	}
}
