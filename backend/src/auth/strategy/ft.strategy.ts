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
		request: { session: { accessToken: string } },
		// request: string,
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		cb: VerifyCallback,
		): Promise<any> {
			request.session.accessToken = accessToken;
			console.log('accessToken', accessToken, 'refreshToken', refreshToken);
			console.log('profile', profile);
			// console.log('profile', profile.name.givenName);
			const user = await this.authService.validateUser(profile);
			console.log('Validate ', user);
			// return cb(null, user);
			return user;
		}
}
