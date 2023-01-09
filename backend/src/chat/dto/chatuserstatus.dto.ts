import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatUserStatusDto {
	@IsString()
	@IsNotEmpty()
	userid: string;

	@IsNumber()
	@IsNotEmpty()
	chatid: number;

	@IsNumber()
	@IsNotEmpty()
	status: number;

	@IsNumber()
	bantime: number;
}