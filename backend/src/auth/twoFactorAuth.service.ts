import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { toFileStream } from 'qrcode';
 
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
    await this.userService.changeUserData(user[0].userid, "2fasecret", secret);
    return {
    	secret,
    	otpauthUrl
    }
  }

	public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: any) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFactorAuthenticationSecret
	})
	}

   public async pipeQrCodeStream(stream: any, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}