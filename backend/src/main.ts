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
		],
		methods: ["GET", "POST"],
	})
	app.use(session({
		secret: "390qofjsliufmpc90a3wrpoa938wmrcpaw3098rmcpa0",
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 60000,
		}
	}))
	app.use(passport.initialize());
	app.use(passport.session());
  	await app.listen(3000);
}
bootstrap();
