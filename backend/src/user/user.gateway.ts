import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UserService } from './user.service';

@WebSocketGateway(3002, {cors: {
	origin: ['http://192.168.56.2:5173','http://localhost:5173'],
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (private readonly userService: UserService) {}

	@SubscribeMessage('message')
	handleConnection(client: any) {
		// console.log(client.request.user);
		if (client.request.user) {
			// console.log("online");
			const user = client.request.user;
			// console.log("handle online", user);
			if (user) {
				this.userService.changeUserData(user.userid, "user_status", 1);
				this.userService.changeUserData(user.userid, "socket_token", client.id);
			}
		}
	}
	
	handleDisconnect(client: any) {
		// console.log(client.request.user);
		if (client.request.user) {
			// console.log("offline");
			const user = client.request.user;
			// console.log("handle offline", user);
			if (user) {
				this.userService.changeUserData(user.userid, "user_status", 0);
				this.userService.changeUserData(user.userid, "socket_token", "");
			}
		}
	}



  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
