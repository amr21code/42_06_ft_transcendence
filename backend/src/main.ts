import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
	  		whitelist: true,
		})
	);

	app.use(passport.initialize());
  	await app.listen(3000);
}
bootstrap();
