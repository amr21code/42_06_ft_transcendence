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
	paddleSpeed: number;

	@IsNumber()
	@IsNotEmpty()
	ballSpeed: number;

	@IsNumber()
	@IsNotEmpty()
	scorePlayer1: number;

	@IsNumber()
	@IsNotEmpty()
	scorePlayer2: number;

	@IsNumber()
	@IsNotEmpty()
	drawLineWidth: number;
}