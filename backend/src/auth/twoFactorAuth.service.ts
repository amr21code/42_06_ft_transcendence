import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { toFileStream } from 'qrcode';
import { Socket } from 'socket.io';
 
@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(@Req() request: Request) {
    const secret = authenticator.generateSecret();
	const user = await this.userService.getMe(request.user);
    const otpauthUrl = authenticator.keyuri(user[0].userid, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
    await this.userService.changeUserData(user[0].userid, "twofasecret", secret);
    return {
    	secret,
    	otpauthUrl
    }
  }

	public isTwoFactorAuthenticationCodeValid(userid: string, twoFactorAuthenticationCode: string, twofasecret: any) {
    console.log(twofasecret);
		const loginstatus = authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: twofasecret[0].twofasecret
			});
		if (loginstatus) {
			this.userService.changeUserData(userid, 'twofalogin', 1);
		}
		return loginstatus;
	}

   public async pipeQrCodeStream(stream: any, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }


  	async socketIO2fa(client: any) {
		// if (client.request.user.userid)
		const user = await this.userService.getAuthCreds(client.request.user.userid);
		console.log(user.userid, "twofa", user.twofa, "twofalogin", user.twofalogin);
		if (user.twofa === 1) {
			if (user.twofalogin === 0) {
				client.emit('2fa');
				return false;
			} else {
				return true;
			}
		}
		return true;
	}
}