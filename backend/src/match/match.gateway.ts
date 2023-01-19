import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(3001, { transport: 'websocket' })
export class MatchGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload);
	return "test";
  }
}
