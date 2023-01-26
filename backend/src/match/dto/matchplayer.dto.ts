import { IsNotEmpty, IsNumber } from "class-validator";
import { MatchPosDto } from "./matchpos.dto";

export class MatchPlayerDto {
	@IsNotEmpty()
	pos: MatchPosDto;

	@IsNotEmpty()
	@IsNumber()
	y_vel: number;

}