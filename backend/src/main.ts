import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
		],
		methods: ["GET", "POST"],
		credentials: true,
	});
	app.use(
		session({
			name: 'ft_pong',
			secret: "390qofjsliufmpc90a3wrpoa938wmrcpaw3098rmcpa0",
			resave: true,
			saveUninitialized: false,
			httpOnly: true,
			cookie: {
				// maxAge: 360000,
			}
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
  	await app.listen(3000);
}
bootstrap();
