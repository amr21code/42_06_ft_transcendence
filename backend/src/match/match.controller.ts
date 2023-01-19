import { Controller, ForbiddenException, Get, Param, Req, Session, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/guards';
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
}
