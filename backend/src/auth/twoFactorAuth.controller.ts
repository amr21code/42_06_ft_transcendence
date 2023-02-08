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
	// return (otpauthUrl);
  }

  @Get('turn-on/:secret')
  @UseGuards(AuthenticatedGuard)
  async turnOnTwoFactorAuthentication(
    @Session() session: Record<string, any>, @Param('secret') secret: string
  ) {
	const twoFaSecret = await this.userService.getUserData(session.passport.user.userid, 'twofasecret');
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
      secret, twoFaSecret
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
	await this.userService.changeUserData(session.passport.user.userid, "twofa", 1);
  }

@Get('authenticate/:secret')
  @UseGuards(AuthenticatedGuard)
  async authenticate(
    @Session() session: Record<string, any>, @Param('secret') secret: string
  ) {
    const twofasecret = await this.userService.getUserData(session.passport.user.userid, 'twofasecret')
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
      secret, twofasecret
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
  }
}
