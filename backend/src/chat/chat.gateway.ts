import { Injectable, NestMiddleware, Session, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionSerializer } from '../auth/serializer'
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { PassportSerializer } from '@nestjs/passport';
import { parse } from 'cookie';
import { Server } from 'http';
import * as cookieParser from 'cookie-parser';
import { sessionMiddleware, wrap } from '../middleware/middleware';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { NextFunction } from 'express';
import { UserService } from 'src/user/user.service';


@WebSocketGateway(3002, {cors: {
	origin: ['http://192.168.56.2:5173','http://localhost:5173'],
	methods: ["GET", "POST"],
	credentials: true,
}
})
@UseGuards(AuthenticatedGuard)
export class ChatGateway {
	constructor(private readonly userService: UserService) {
			// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
	}

  @SubscribeMessage('message')
//  handleConnection(@Session() session: Record<string, any>, client: any): string {
	handleConnection( client: any, payload: any): string {
	// const cookieParser = require('cookie-parser');
	//var cookie = parse(session.handshake.headers.cookie);
	//var unsigned_cookie = cookieParser.signedCookie(cookie.ft_pong, "390qofjsliufmpc90a3wrpoa938wmrcpaw3098rmcpa0");
	//console.log(cookie);
	console.log("jop");
	console.log(payload);
	//console.log(unsigned_cookie);
	console.log(client.username);
	console.log('socketio', client.request.user);
	const user = client.request.user;
	if (user)
		this.userService.changeUserData(user.userid, "user_status", 1);



	// console.log(cookieParser.signedCookie(cookie, "390qofjsliufmpc90a3wrpoa938wmrcpaw3098rmcpa0"));
	// console.log(session);
	// this.serializer.deserializeUser(session.handshake.headers.cookie.substr(8));
	// console.log(session.passport.user.userid);
    return 'Hello world!';
  }

  handleDisconnect(client: any, payload: any): string {
	console.log("jop");
	const user = client.request.user;
	//this.userService.changeUserData(user.userid, "user_status", 0);
    return 'Hello world!';
  }
}
