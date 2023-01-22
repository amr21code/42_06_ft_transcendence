import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import * as express from 'express';
import * as passport from "passport";
import { INestApplicationContext, Injectable, Module } from "@nestjs/common";
import { sessionMiddleware } from "./middleware";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "./user/user.service";
import { UserModule } from "./user/user.module";
import { DbService } from "./db/db.service";

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
//   private session: Record<string, any>;
  	private session: express.RequestHandler;
	private userService: UserService;

  	constructor(private request: express.RequestHandler, app: INestApplicationContext) {
//   constructor(session: Record<string, any>, app: INestApplicationContext) {
//   constructor(app: INestApplicationContext) {
  		super(app);
//  super(session);
 		this.session = request;
	}

  	createIOServer(port: number, options?: ServerOptions): Server {
		const server: Server = super.createIOServer(port, options);

		const wrap = (middleware) => (socket, next) =>
		middleware(socket.request, {}, next);
		server.use((socket, next) => {
			socket.on('send-chat-message', ({userid, chatid, message}) => {
				// console.log("backend:", userid, chatid, message);
				socket.emit('chat-message', {userid : userid, chatid : chatid, message :message});
			});

			socket.on('send-chat-refresh', () => {
				// console.log("backend: got send-chat-refresh");
				socket.emit('refresh-chat');
			});

			socket.on('send-chat-deleted', () => {
				// console.log("backend: got send-chat-deleted");
				socket.emit('chat-deleted');
			})

			// socket.on('get messages', ({chatid}) => {
			// 	console.log(socket.id, chatid);
			// 	socket.emit('get messages', {chatid});
			// });
		next();
    });

	// server.use((socket, next) => {
	// 	// console.log("created: ", socket.id);
	// 	socket.on('chat message', ({chatid, message}) => {
	// 		console.log(socket.id, chatid, message);
	// 		socket.broadcast.to(chatid).emit('chat message', {chatid, message});
	// 	});
	// 	next();
	// });


	// server.on("connect", socket => {
	// 	if (socket.request.session.passport) {
	// 		console.log('test', socket.request.session.passport.user);
	// 		const user = socket.request.session.passport.user;
	// 		console.log("handleconnection", socket.id);
	// 		if (user) {
	// 			this.userService.changeUserData(user.userid, "user_status", 1);
	// 			this.userService.changeUserData(user.userid, "socket_token", socket.id);
	// 		}
	// 	}
	// });


    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
	//server.use(wrap(sessionMiddleware));
    return server;
  }
}