import { IsNotEmpty, IsNumber } from "class-validator";

export class MatchPosDto {
	@IsNumber()
	@IsNotEmpty()
	x: number;

	@IsNumber()
	@IsNotEmpty()
	y: number;
}