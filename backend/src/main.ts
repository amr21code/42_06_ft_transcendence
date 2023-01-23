import { ValidationPipe, Session } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { sessionMiddleware, wrap } from './middleware/middleware';
import { SessionAdapter } from './session.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
	  		whitelist: true,
		})
	);
	app.enableCors({
		origin: `${process.env.FRONTEND_URL}`,
		methods: ["GET", "POST"],
		credentials: true,
	});
	app.use(sessionMiddleware);

	app.use(passport.initialize());
	app.use(passport.session());
	app.useWebSocketAdapter(new SessionAdapter(sessionMiddleware, app))
  	await app.listen(3000);
}
bootstrap();
