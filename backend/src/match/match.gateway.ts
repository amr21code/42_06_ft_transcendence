import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { MatchService } from './match.service';

@WebSocketGateway(3002, { cors: {
	origin: ['http://192.168.56.2:5173','http://localhost:5173'],
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class MatchGateway {
  constructor(private readonly userService: UserService, private readonly matchService: MatchService) {
	}

  	@SubscribeMessage('message')
  	handleMessage(client: any, payload: any): string {
    	console.log(payload);
		return "test";
  }

  @SubscribeMessage('send-opponent-status')
	async refreshChat(client: Socket, payload: any) {
    // const status = this.matchService.getOpponentStatus(payload.matchid, payload.userid);
	//client.emit('opponent-status', {data: status});
    client.emit('opponent-status', {data: true});
    return true;
	}

}
