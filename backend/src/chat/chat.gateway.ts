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
async deleteChat(client: Socket) {
	// muss in DB geleavt werden
	client.emit('refresh-chat');
	client.emit('chat-leave');
}

//   @SubscribeMessage('message')
// //  handleConnection(@Session() session: Record<string, any>, client: any): string {
// 	handleConnection( client: any): string {
// 	console.log("login");
// 	// const user = client.request.user;
// 	// console.log(client.data.user);
// 	// console.log(client.id);
// 	// if (user) {
// 	// 	this.userService.changeUserData(user.userid, "user_status", 1);
// 	// 	this.userService.changeUserData(user.userid, "socket_token", client.id);
// 	// }

//     return 'Hello world!';
//   }

//   handleDisconnect(client: any): string {
// 	console.log("log out");
// 	console.log(client.id);
// 	// console.log(client);
// 	//todo change user_status to 0 for user with clientid = client.id
//     return 'Hello world!';
//   }
}
