import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
	@IsString()
	@IsNotEmpty()
	user: string;
}