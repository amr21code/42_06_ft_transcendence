import { ValidationPipe, Session } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { sessionMiddleware, wrap } from './middleware/middleware';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as express from 'express';
import { UserService } from './user/user.service';
import { SessionAdapter } from './session.adapter';
import * as session from 'express-session';

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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
//  const app2 = express();
//  const httpServ = createServer(app2);
//  const io = new Server(httpServ, {
//	cors: {
//		origin: ['http://192.168.56.2:5173','http://localhost:5173'],
//		methods: ["GET", "POST"],
//		credentials: true,
//	}
//  })
	app.useGlobalPipes(
		new ValidationPipe({
	  		whitelist: true,
		})
	);
	app.enableCors({
		origin: [
			'http://localhost:5173',
			'http://192.168.56.2:5173',
			'http://192.168.56.2:3000',
			'http://localhost:8080',
			'http://192.168.56.2:3002',
		],
		methods: ["GET", "POST"],
		credentials: true,
	});
	app.use(sessionMiddleware);

	//io.use(wrap(sessionMiddleware));
	//io.use(wrap(passport.initialize()));
	//io.use(wrap(passport.session()));
	//io.listen(3002);
	//// io.use((socket, next) => {
	//// 	sessionMiddleware(socket.request as Record<string, any>, {} as Response, next as express.NextFunction);
	//// });
	//io.use((socket, next) => {
	//	if (socket.request) {
	//		next();
	//	} else {
	//		console.log("nothing");
	//	}
	//});

	//io.on("connect", socket => {
	//	if (socket.request.session.passport){
	//		console.log('test', socket.request.session.passport.user);
	//		socket.request.session.passport.user["user_status"] = 1;
	//		console.log('test', socket.request.session.passport.user);
			
	//	}
	//});

	//io.on("disconnect", socket => {
	//	console.log("ende?");
	//	if (socket.request.session.passport) {
	//		const sessionID = socket.request.sessionID;
	//		socket.request.session.destroy(() => {
	//			io.to(sessionID).disconnectSockets();
	//		});
	//		console.log('session end', sessionID);
	//	}
	//});
	app.use(passport.initialize());
	app.use(passport.session());
	app.useWebSocketAdapter(new SessionAdapter(sessionMiddleware, app))
  	await app.listen(3000);
}
bootstrap();
