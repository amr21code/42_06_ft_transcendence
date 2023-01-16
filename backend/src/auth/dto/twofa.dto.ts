import { IsNotEmpty, IsString } from "class-validator";

export class TwoFaDto {
	@IsString()
	@IsNotEmpty()
	twoFactorAuthenticationCode: string;
}