import { IsNotEmpty, IsNumber} from "class-validator";
import { MatchBallDto } from "./matchball.dto";
import { MatchPlayerDto } from "./matchplayer.dto";

export class MatchGameStateDto {
	@IsNotEmpty()
	player1: MatchPlayerDto;

	@IsNotEmpty()
	player2: MatchPlayerDto;

	@IsNotEmpty()
	ball: MatchBallDto;

	@IsNotEmpty()
	@IsNumber()
	paddleWidth: number;

	@IsNotEmpty()
	@IsNumber()
	paddleHeight: number;

	@IsNotEmpty()
	@IsNumber()
	ballSize: number;

	@IsNotEmpty()
	@IsNumber()
	wallOffset: number;

	@IsNotEmpty()
	@IsNumber()
	canvasHeight: number;
	
	@IsNotEmpty()
	@IsNumber()
	canvasWidth: number;

	@IsNotEmpty()
	@IsNumber()
	stepSize: number;


}