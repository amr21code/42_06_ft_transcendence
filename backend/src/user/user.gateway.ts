import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MatchService } from 'src/match/match.service';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/guards';

@WebSocketGateway(3002, {cors: {
	origin: `${process.env.FRONTEND_URL}`,
	methods: ["GET", "POST"],
	credentials: true,
}
})
@UseGuards(AuthenticatedGuard)
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (private readonly userService: UserService, private readonly matchService: MatchService) {}

	@WebSocketServer()
	public server: Server;

	@SubscribeMessage('send-userdata-refresh')
	async userdataRefresh(client: any) {
		client.broadcast.emit('userdata-refresh');
		client.emit('userdata-refresh');
	}

	@SubscribeMessage('user')
	async handleConnection(client: any) {
		try {
			if (client.request.user) {
				const user = client.request.user;
				if (user) {
					await this.userService.changeUserData(user.userid, "user_status", 1);
					await this.userService.changeUserData(user.userid, "socket_token", client.id);
				}
				console.log("handle online", await this.userService.getUserData(user.userid, "socket_token"), user.userid);
			}
		} catch (error) {
			throw new WsException('disconnect');
		}
	}
	
	async handleDisconnect(client: any) {
		try {
			if (client.request.user) {
				const user = client.request.user;
				if (user) {
					const status = await this.userService.getUserData(user.userid, "user_status");
					console.log("user status", status);
					if (status[0].user_status == 3) {
						this.matchService.deleteMatch(user.userid);
					} else if (status[0].user_status == 2){	//end match, other player wins
						console.log("user left");
						const matchid = await this.matchService.listMatch(user.userid);
						const opp = await this.matchService.getOpponent(user.userid, matchid[0].matchid);
						this.server.to(matchid[0].matchid).emit('opponentLeft', matchid[0].matchid, user.userid); // to MatchCourt
						//update game 
					}
					await this.userService.changeUserData(user.userid, "user_status", 0);
					await this.userService.changeUserData(user.userid, "socket_token", "");
					await this.userService.changeUserData(user.userid, "twofalogin", 0);
				}
				console.log("handle offline", await this.userService.getUserData(user.userid, "socket_token"), user.userid);
			}
		} catch (error) {
			throw new WsException('disconnect');
		}
	}
}
