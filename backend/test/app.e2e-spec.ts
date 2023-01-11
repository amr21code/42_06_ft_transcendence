import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as passport from 'passport';
import * as session from 'express-session';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  	let app: INestApplication;
  	beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
 	app = moduleRef.createNestApplication();
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
	});
  	app.use(
		session({
			secret: "390qofjsliufmpc90a3wrpoa938wmrcpaw3098rmcpa0",
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 60000,
			}
		})
	);
  	app.use(passport.initialize());
	app.use(passport.session());
  await app.init();
  });
  afterAll( () => {
    app.close();
  });
  it.todo('should pass');
});

