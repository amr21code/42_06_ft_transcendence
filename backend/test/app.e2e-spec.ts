import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as passport from 'passport';
import * as session from 'express-session';
import { AppModule } from '../src/app.module';
import { DbService } from '../src/db/db.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('App e2e', () => {
  	let app: INestApplication;
	let db: DbService;
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
	await app.listen(3333);
	db = app.get(DbService);
	await db.cleanDb();
	pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll( () => {
    app.close();
  });
  describe('Auth', () => {
	describe('login', () => {
		it('should throw error', () => {
			const dto: AuthDto ={
				userid:''
			}
			return pactum.spec().get(
				'/auth/login'
			).withBody(dto).expectStatus(400);
		})
		it('should login', () => {
			const dto: AuthDto ={
				userid:'djedasch'
			}
			return pactum.spec().get(
				'/auth/login'
			).withBody(dto).expectStatus(302);
		})
		it('show status', () => {
			return pactum.spec().get(
				'/auth/status'
			).expectStatus(302);
		})
	});
	//describe('Signup', () => {});
	//describe('2 factor authentifikation', () => {});
  });
  describe('User', () => {
	describe('show profile', () => {
		it('show profile information', () => {
			return pactum.spec().get(
				'/users/me'
			).expectStatus(200);
		})
		it('show profile information', () => {
			return pactum.spec().get(
				'/users/djedasch'
			).expectStatus(200);
		})
		it('show all users', () => {
			return pactum.spec().get(
				'/users/all'
			).expectStatus(200);
		})
	});
	describe('edit name', () => {
		it('change username', () => {
			return pactum.spec().get(
				'/users/djedasch/username/Désirée'
			).expectStatus(200);
		})
	});
	describe('change online status', () => {
				it('change online status', () => {
			return pactum.spec().get(
				'/users/djedasch/user_status/2'
			).expectStatus(200);
		})
	});
	describe('change avatar', () => {
		it('change avatar', () => {
			return pactum.spec().get(
				'/users/djedasch/avatar/1'
			).expectStatus(200);
		})
	});
	//describe('add achievement', () => {});
	//describe('change 2 factor authentifikation', () => {});
  });
  describe('Friends', () => {
	describe('Show Friends', () => {});
	describe('Add friend, block s.o.', () => {});
	describe('Accept friend request', () => {});
	describe('delete friend, unblock s.o.', () => {});
  });
  
  describe('Chat', () => {
	describe('show chat list', () => {});
	describe('create new chat', () => {});
	describe('change chat attributes', () => {});
	describe('change chat user status', () => {});
	describe('send message', () => {});
	describe('show messages', () => {});
  });
  it.todo('should pass');
});

