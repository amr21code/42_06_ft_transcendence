import { UseGuards, } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WsException} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { ChatMessageDto } from './dto';
import { TwoFactorAuthenticationService } from 'src/auth/twoFactorAuth.service';

@WebSocketGateway(3002, {cors: {
	origin: `${process.env.FRONTEND_URL}`,
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class ChatGateway {
	constructor(private readonly chatService: ChatService, private readonly twoFAService: TwoFactorAuthenticationService) {
	}

	@SubscribeMessage('send-chat-message')
	async handleMessage(client: Socket, message: ChatMessageDto) {
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');
			if (message.message != '') {
				if (await this.chatService.addMessage(message))
				{
					client.broadcast.emit('chat-message', { username: message.username, userid: message.userid, chatid: message.chatid, message: message.message});
					client.emit('chat-message', { username: message.username, userid: message.userid, chatid: message.chatid, message: message.message});
				}
			}
		} catch (error) {
			throw new WsException('add message in socketIO message-handler failed');
		}
	}

	@SubscribeMessage('send-chat-refresh')
	async refreshChat(client: Socket) {
		if (!this.twoFAService.socketIO2fa(client))
			throw new WsException('no 2fa authenticated');
		client.broadcast.emit('refresh-chat');
		client.emit('refresh-chat');
	}


	@SubscribeMessage('send-chat-leave')
	async leaveChat(client: Socket, message: Record<string, number>) {
		try {
			if (!this.twoFAService.socketIO2fa(client))
				throw new WsException('no 2fa authenticated');
			this.chatService.leaveChat(client.request.session.passport.user.userid, message.chatid);
			client.emit('refresh-chat');
			client.emit('chat-leave');
		} catch (error) {
			throw new WsException('leave chat in socketIO message-handler failed');
		}
	}

	@SubscribeMessage('send-got-kicked')
	async gotKicked(client: Socket, data: Record<string, string>) {
		if (!this.twoFAService.socketIO2fa(client))
			throw new WsException('no 2fa authenticated');
		console.log(data);
		client.broadcast.emit('got-kicked', data);
		client.emit('got-kicked', data);
	}

	@SubscribeMessage('send-got-banned')
	async gotBanned(client: Socket, data: Record<string, string>) {
		if (!this.twoFAService.socketIO2fa(client))
			throw new WsException('no 2fa authenticated');
		console.log(data);
		client.broadcast.emit('got-banned', data);
		client.emit('got-banned', data);
	}

	@SubscribeMessage('send-got-muted')
	async gotMuted(client: Socket, data: Record<string, string>) {
		if (!this.twoFAService.socketIO2fa(client))
			throw new WsException('no 2fa authenticated');
		console.log(data);
		client.broadcast.emit('got-muted', data);
		client.emit('got-muted', data);
	}


}
