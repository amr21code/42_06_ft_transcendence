import { Session, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AuthenticatedGuard } from 'src/auth/guards/guards';

@WebSocketGateway(3002, { cors: 'http://192.168.56.2:3002' })
export class ChatGateway {
  @SubscribeMessage('message')
  handleConnection(@Session() session: Record<string, any>, client: any): string {
	console.log("jop");
	console.log(session.id);
	// console.log(session.passport.user.userid);
    return 'Hello world!';
  }

  handleDisconnect(client: any, payload: any): string {
	console.log("jop");
    return 'Hello world!';
  }
}
