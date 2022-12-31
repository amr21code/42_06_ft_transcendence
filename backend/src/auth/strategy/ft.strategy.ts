import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy( Strategy, '42' ) {
	constructor(config: ConfigService) {
		super({
			clientID: config.get('UID_42'),
			clientSecret: config.get('SECRET_42'),
			callbackURL: "http://192.168.56.2:3000/auth/return",
			passReqToCallback: true,
		});
	}

	async validate (
		// request: { session: { accessToken: string } },
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		cb: VerifyCallback,
		): Promise<any> {
			// request.session.accessToken = accessToken;
			console.log('accessToken', accessToken, 'refreshToken', refreshToken);
			// return cb(null, profile);
		}
}