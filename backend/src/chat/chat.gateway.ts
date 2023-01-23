import { ForbiddenException, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { ChatMessageDto } from './dto';


@WebSocketGateway(3002, {cors: {
	origin: ['http://192.168.56.2:5173','http://localhost:5173'],
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class ChatGateway {
	constructor(private readonly userService: UserService, private readonly chatService: ChatService) {
			// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
	}

	@SubscribeMessage('send-chat-message')
	async handleMessage(client: Socket, message: ChatMessageDto) {
		try {
			console.log("handleMessage()");
			console.log(message);
			await this.chatService.addMessage(message);
			console.log(message.username);
			client.emit('chat-message', { username: message.username, userid: message.userid, chatid: message.chatid, message: message.message});
		} catch (error) {
			throw new ForbiddenException('add message in socketIO message-handler failed');
		}
	}

	@SubscribeMessage('send-chat-refresh')
	async refreshChat(client: Socket) {
		// console.log("backend: got send-chat-refresh");
		client.emit('refresh-chat');
	}


	@SubscribeMessage('send-chat-leave')
	async leaveChat(client: Socket, message: Record<string, number>) {
		// console.log(message.chatid);
		this.chatService.leaveChat(client.request.session.passport.user.userid, message.chatid);
		client.emit('refresh-chat');
		client.emit('chat-leave');
	}

}
