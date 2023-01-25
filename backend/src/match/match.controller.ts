import { Body, Controller, ForbiddenException, Get, Param, Post, Req, Session, UseGuards } from '@nestjs/common';
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
	@Post('gameover')
	async gameOver(@Body() state: MatchGameStateDto, @Session() session: Record<string, any>){
		console.log("gameover");
		const userid = session.passport.user.userid;
		const matchid = await this.matchService.listActiveMatch(userid);
		const update = await this.matchService.updateMatch(matchid[0].matchid, userid, state.scorePlayer1); //how do I know if I'm Player1 or Player2
		return(update);
	}
}
