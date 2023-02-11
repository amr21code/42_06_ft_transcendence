import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { MatchPosDto } from "./matchpos.dto";

export class MatchPlayerDto {
	@IsString()
	userid: string;

	@IsNotEmpty()
	pos: MatchPosDto;

	@IsNotEmpty()
	@IsNumber()
	y_vel: number;

}