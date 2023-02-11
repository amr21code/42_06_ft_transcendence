import {  ClassSerializerInterceptor, Controller, Get, UseInterceptors, Res, UseGuards, Req, UnauthorizedException, Param, Session} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuth.service';
import { Response } from 'express';
import { Request } from 'express';
import { AuthenticatedGuard } from './guards/guards';
import { UserService } from 'src/user/user.service';
 
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthenticationService,
	  private readonly userService: UserService
  ) {}
 
  @Get('generate')
  @UseGuards(AuthenticatedGuard)
  async register(@Res() response: Response, @Req() request: Request) {
    const { otpauthUrl } = await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(request);
    console.log("generate 2fa secret");
    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Get('turn-on/:secret')
  @UseGuards(AuthenticatedGuard)
  async turnOnTwoFactorAuthentication(
    @Session() session: Record<string, any>, @Param('secret') secret: string
  ) {
	const twoFaSecret = await this.userService.getUserData(session.passport.user.userid, 'twofasecret');
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
		session.passport.user.userid, secret, twoFaSecret
    );
    if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
    }
	await this.userService.changeUserData(session.passport.user.userid, "twofa", 1);
	session.passport.user.twofa = 1;
  }

	@Get('authenticate/:secret')
  	async authenticate(
    @Session() session: Record<string, any>, @Param('secret') secret: string) {
    	const twofasecret = await this.userService.getUserData(session.passport.user.userid, 'twofasecret')
    	const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
			session.passport.user.userid, secret, twofasecret
    	);
    	if (!isCodeValid) {
      		throw new UnauthorizedException('Wrong authentication code');
    	}
		await this.userService.changeUserData(session.passport.user.userid, "twofalogin", 1);
		session.passport.user.twofalogin = 1;
  	}
}
