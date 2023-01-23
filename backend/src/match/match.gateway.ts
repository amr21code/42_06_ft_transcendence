import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(3002, { cors: {
	origin: `${process.env.FRONTEND_URL}`,
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
}
