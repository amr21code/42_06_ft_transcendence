import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatDto {
	@IsNumber()
	@IsNotEmpty()
	type: number;

	@IsNumber()
	@IsNotEmpty()
	chatid: number;

	@IsString()
	@IsNotEmpty()
	chat_name: string;

	@IsString()
	password: string;
}