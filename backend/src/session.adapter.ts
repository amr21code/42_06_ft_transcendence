import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import * as express from 'express';
import * as passport from "passport";
import { INestApplicationContext } from "@nestjs/common";
import { sessionMiddleware } from "./middleware";
import { PassportModule } from "@nestjs/passport";

export class SessionAdapter extends IoAdapter {
  private session: express.RequestHandler;

  constructor(session: express.RequestHandler, app: INestApplicationContext) {
  super(app);
//  super(session);
  this.session = session;
}
  createIOServer(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, options);

    const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);

    server.use((socket, next) => {
      socket.data.username = 'test'; //passing random property to see if use method is working
	  socket.data.user = this.session;
      next();
    });
    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
	//server.use(wrap(sessionMiddleware));
    return server;
  }
}