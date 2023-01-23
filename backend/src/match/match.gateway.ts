import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(3002, { cors: {
	origin: ['http://192.168.56.2:5173','http://localhost:5173'],
	methods: ["GET", "POST"],
	credentials: true,
}
})
export class MatchGateway {
	constructor() {}

  	@SubscribeMessage('message')
  	handleMessage(client: any, payload: any): string {
    	console.log(payload);
		return "test";
  }

  @SubscribeMessage('send-copponent-status')
	async refreshChat(client: Socket) {
		// console.log("backend: got send-chat-refresh");
		client.emit('opponent-status');
    return true;
	}

}
