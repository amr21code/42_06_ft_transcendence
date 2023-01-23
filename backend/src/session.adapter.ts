import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import * as express from 'express';
import * as passport from "passport";
import { INestApplicationContext} from "@nestjs/common";
import { UserService } from "./user/user.service";

declare module "http" {
	interface IncomingMessage {
		session: Record<string, any> & {
			passport: {
				user: {
					userid: string,
				}
			}
		};
	}
}

export class SessionAdapter extends IoAdapter {
  	private session: express.RequestHandler;
	private userService: UserService;

  	constructor(private request: express.RequestHandler, app: INestApplicationContext) {
  		super(app);
 		this.session = request;
	}

  	createIOServer(port: number, options?: ServerOptions): Server {
		const server: Server = super.createIOServer(port, options);

		const wrap = (middleware) => (socket, next) =>
		middleware(socket.request, {}, next);
		server.use((socket, next) => {

			socket.on('send-chat-deleted', () => {
				socket.emit('chat-deleted');
			})
		next();
    });
    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
    return server;
  }
}