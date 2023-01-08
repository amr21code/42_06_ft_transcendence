import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatMessageDto {
	@IsString()
	@IsNotEmpty()
	userid: string;

	@IsNumber()
	@IsNotEmpty()
	chatid: number;

	@IsString()
	@IsNotEmpty()
	message: string;
}