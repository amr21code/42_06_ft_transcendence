import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UserService } from './user.service';

@WebSocketGateway(3002, {cors: {
	origin: `${process.env.FRONTEND_URL}`,
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (private readonly userService: UserService) {}

	@SubscribeMessage('user')
	async handleConnection(client: any) {
		if (client.request.user) {
			const user = client.request.user;
			if (user) {
				await this.userService.changeUserData(user.userid, "user_status", 1);
				await this.userService.changeUserData(user.userid, "socket_token", client.id);
			}
			console.log("handle online", await this.userService.getUserData(user.userid, "socket_token"), user.userid);
		}
	}
	
	async handleDisconnect(client: any) {
		if (client.request.user) {
			const user = client.request.user;
			if (user) {
				await this.userService.changeUserData(user.userid, "user_status", 0);
				await this.userService.changeUserData(user.userid, "socket_token", "");
			}
			console.log("handle offline", await this.userService.getUserData(user.userid, "socket_token"), user.userid);
		}
	}

  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
