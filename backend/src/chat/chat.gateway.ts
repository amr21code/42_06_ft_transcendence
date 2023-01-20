import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { UserService } from 'src/user/user.service';


@WebSocketGateway(3002, {cors: {
	origin: ['http://192.168.56.2:5173','http://localhost:5173'],
	methods: ["GET", "POST"],
	credentials: true,
}
})
@UseGuards(AuthenticatedGuard)
export class ChatGateway {
	constructor(private readonly userService: UserService) {
			// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
	}

	@SubscribeMessage('chat')
	handleMessage(client: any, payload: string) : string{
		return payload;
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
