import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FtStrategy extends PassportStrategy( Strategy, '42' ) {
	constructor(config: ConfigService, @Inject('AUTH_SERVICE') private readonly authService: AuthService) {
		super({
			clientID: config.get('UID_42'),
			clientSecret: config.get('SECRET_42'),
			callbackURL: config.get('CALLBACK_URL'),
			passReqToCallback: true,
		});
	}

	async validate (
		request: { session: { accessToken: string, user: any } },
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		cb: VerifyCallback,
		): Promise<any> {
			console.log("strategy validate");
			request.session.accessToken = accessToken;
			const user = await this.authService.validateUser(profile, accessToken);
			request.session.user = user;
			return cb(null, user);
		}
}
