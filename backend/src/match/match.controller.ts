import { Body, Controller, ForbiddenException, Get, Param, Post, Req, Session, UseGuards } from '@nestjs/common';
import { Validator } from 'class-validator';
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { MatchGameStateDto } from './dto/matchgamestate.dto';
import { MatchService } from './match.service';

@Controller('match')
@UseGuards(AuthenticatedGuard)
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@Get('list')
	async listMatches() {
		return this.matchService.listMatches();
	}

	@Get('open/:opponent?')
	async openMatch(@Param('opponent') opponent, @Session() session: Record<string, any>) {
		const open = await this.matchService.openMatch(session.passport.user.userid, 1, opponent);
	}

	@Get('opensingle')
	async opensingleMatch( @Session() session: Record<string, any>) {
		const open = await this.matchService.openSingleMatch(session.passport.user.userid, 1);
	}

	@Get('accept')
	async acceptMatch(@Session() session: Record<string, any>) {
		try {
			const accept = await this.matchService.acceptMatch(session.passport.user.userid);
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Get('delete')
	async deleteMatch(@Session() session: Record<string, any>) {
		try {
			const del = await this.matchService.deleteMatch(session.passport.user.userid);
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	@Get('making')
	async matchmaking(@Session() session: Record<string, any>) {
		try {
			const match = await this.matchService.matchmaking(session.passport.user.userid);
			return {"msg" : "ok" };
		} catch (error) {
			throw error;
		}
	}

	//@Get('makingUnsafe')
	//async matchmakingUnsafe(@Session() session: Record<string, any>) {
	//	try {
	//		const match = await this.matchService.matchmakingUnsafe(session.passport.user.userid);
	//		return {"msg" : "ok" };
	//	} catch (error) {
	//		throw error;
	//	}
	//}

	@Post('gameover/:playerNumber')
	async gameOver(@Body() state: MatchGameStateDto,@Param() playerNumber:any,  @Session() session: Record<string, any>){
		//console.log("gameover");
		const userid = session.passport.user.userid;
		try {
			const matchid = await this.matchService.listActiveMatch(userid);
			//get Player from database (1 or 2)
			var update;
			console.log("Playernumber in gameover", playerNumber.playerNumber)
			//console.log("gamestate", state)
			if (matchid[0].matchid) {
				if (playerNumber.playerNumber == 1)
					update = await this.matchService.updateMatch(matchid[0].matchid, userid, state.scorePlayer1);
				else
					update = await this.matchService.updateMatch(matchid[0].matchid, userid, state.scorePlayer2);
				return(update);
			}
		} catch (error) {
			throw new ForbiddenException;
		}
		return;
	}
}
