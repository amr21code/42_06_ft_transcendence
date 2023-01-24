import { ForbiddenException, } from '@nestjs/common';
import {  SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { ChatMessageDto } from './dto';
import { ConfigModule, ConfigService } from '@nestjs/config';


@WebSocketGateway(3002, {cors: {
	origin: `${process.env.FRONTEND_URL}`,
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class ChatGateway {
	constructor(private readonly userService: UserService, private readonly chatService: ChatService) {
	}

	@SubscribeMessage('send-chat-message')
	async handleMessage(client: Socket, message: ChatMessageDto) {
		try {
			await this.chatService.addMessage(message);
			client.emit('chat-message', { username: message.username, userid: message.userid, chatid: message.chatid, message: message.message});
		} catch (error) {
			throw new ForbiddenException('add message in socketIO message-handler failed');
		}
	}

	@SubscribeMessage('send-chat-refresh')
	async refreshChat(client: Socket) {
		client.emit('refresh-chat');
	}


	@SubscribeMessage('send-chat-leave')
	async leaveChat(client: Socket, message: Record<string, number>) {
		try {
			this.chatService.leaveChat(client.request.session.passport.user.userid, message.chatid);
			client.emit('refresh-chat');
			client.emit('chat-leave');
		} catch (error) {
			throw new ForbiddenException('leave chat in socketIO message-handler failed');
		}
	}

}
