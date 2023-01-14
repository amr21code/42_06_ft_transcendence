import {  ClassSerializerInterceptor, Controller, Header, Post, UseInterceptors, Res, UseGuards, Req, HttpCode, Body, UnauthorizedException} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuth.service';
import { Response } from 'express';
import { Request } from 'express';
import { FtAuthGuard } from './guards/guards';
import { UserService } from 'src/user/user.service';
 
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthenticationService,
	private readonly userService: UserService
  ) {}
 
  @Post('generate')
  @UseGuards(FtAuthGuard)
  async register(@Res() response: Response, @Req() request: Request) {
    const { otpauthUrl } = await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(request);
 
    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(FtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: Request,
    @Body() { twoFactorAuthenticationCode }
  ) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode, request.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
	const user = await this.userService.getMe(request.user);
	await this.userService.changeUserData(user[0].userid, "twofa", 1);
  }

@Post('authenticate')
  @HttpCode(200)
  @UseGuards(FtAuthGuard)
  async authenticate(
    @Req() request: Request,
    @Body() { twoFactorAuthenticationCode }
  ) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode, request.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
 
    //const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
 
    //request.res.setHeader('Set-Cookie', [accessTokenCookie]);
 
    return request.user;
  }
}
