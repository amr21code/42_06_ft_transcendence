import { IsNotEmpty, IsNumber, IsString, Length, Matches } from "class-validator";

export class ChatDto {
	@IsNumber()
	@IsNotEmpty()
	type: number;

	@IsNumber()
	@IsNotEmpty()
	chatid: number;

	@IsString()
	@Length(3, 20)
	@Matches('^[a-zA-Z0-9_ ]*$')
	chat_name: string;
	
	@IsString()
	@Length(0, 20)
	@Matches('^[a-zA-Z0-9]*$')
	password: string;
}