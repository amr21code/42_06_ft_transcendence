import { Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedGuard } from 'src/auth/guards/guards';

@Controller('chat')
// @UseGuards(AuthenticatedGuard)
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('list')
	async listChats() {
		try {
			const list = await this.chatService.listChats();
			return { msg : "ok" };
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Get('join/:chatid/:pw') // optional pw?
	async joinChat(@Param('chatid') chatid, @Param('pw') pw?) { 
		const join = await this.chatService.joinChat(chatid, pw);
		return join;
	}
}
