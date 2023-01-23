import {  ClassSerializerInterceptor, Controller, Header, Post, Get, UseInterceptors, Res, UseGuards, Req, HttpCode, Body, UnauthorizedException, Param} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuth.service';
import { Response } from 'express';
import { Request } from 'express';
import { AuthenticatedGuard } from './guards/guards';
import { UserService } from 'src/user/user.service';
import { TwoFaDto } from './dto/twofa.dto';
 
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
  //@HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: Request, @Param('secret') secret: string
    //@Body() { twoFactorAuthenticationCode } : TwoFaDto
  ) {
    //console.log("turn on");
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
      secret, request.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
	const user = await this.userService.getMe(request.user);
	await this.userService.changeUserData(user[0].userid, "twofa", 1);
  }

@Get('authenticate/:secret')
  //@HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  async authenticate(
    @Req() request: Request, @Param('secret') secret: string
    //@Body() { twoFactorAuthenticationCode } : TwoFaDto
  ) {
    const user = await this.userService.getMe(request.user);
    const twofasecret = await this.userService.getUserData(user[0].userid, 'twofasecret')
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
      secret, twofasecret
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return request.user;
  }
}
