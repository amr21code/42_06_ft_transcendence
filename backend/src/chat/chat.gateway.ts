import { Session, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { SessionSerializer } from '../auth/serializer'
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { PassportSerializer } from '@nestjs/passport';
import { parse } from 'cookie';

@WebSocketGateway(3002, { cors: {
	origin: 'http://192.168.56.2:5173',
	methods: ["GET", "POST"],
	credentials: true,
}
})
// @UseGuards(AuthenticatedGuard)
export class ChatGateway {
	constructor(private readonly serializer: SessionSerializer) {
			// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
	}

  @SubscribeMessage('message')
  handleConnection(@Session() session: Record<string, any>, client: any): string {
	console.log("jop");
	console.log(parse(session.handshake.headers.cookie));
	// console.log(session);
	// this.serializer.deserializeUser(session.handshake.headers.cookie.substr(8));
	// console.log(session.passport.user.userid);
    return 'Hello world!';
  }

  handleDisconnect(client: any, payload: any): string {
	console.log("jop");
    return 'Hello world!';
  }
}
