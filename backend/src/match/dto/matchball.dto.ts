import { IsNotEmpty, IsNumber } from "class-validator";
import { MatchPosDto } from "./matchpos.dto";

export class MatchBallDto {
	@IsNotEmpty()
	pos: MatchPosDto;

	@IsNotEmpty()
	vel: MatchPosDto;
}