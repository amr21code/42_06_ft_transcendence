import { Controller, ForbiddenException, Get, Param, Post, Req, Session, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { MatchService } from './match.service';

@Controller('match')
@UseGuards(AuthenticatedGuard)
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@Get('list')
	async listMatches() {
		try {
			return this.matchService.listMatches();
		} catch (error) {
			throw new ForbiddenException('list matches');
		}
	}

	@Get('open/:opponent?')
	async openMatch(@Param('opponent') opponent, @Session() session: Record<string, any>) {
		try {
			const open = await this.matchService.openMatch(session.passport.user.userid, 1, opponent);
		} catch (error) {
			throw new ForbiddenException('open match');
		}
	}

	@Get('opensingle')
	async opensingleMatch(@Session() session: Record<string, any>) {
		try {
			const open = await this.matchService.openSingleMatch(session.passport.user.userid, 1);
		} catch (error) {
			throw new ForbiddenException('open single matche');
		}
	}

	@Get('history/:userid?')
	async showHistory(@Session() session: Record<string, any>, @Param('userid') userid) {
		try {
			if (!userid)
				userid = session.passport.user.userid;
			const history = this.matchService.showHistory(userid);
			return history;
		} catch (error) {
			throw new ForbiddenException('show history');
		}
	}

	@Get('accept')
	async acceptMatch(@Session() session: Record<string, any>) {
		try {
			const accept = await this.matchService.acceptMatch(session.passport.user.userid);
		} catch (error) {
			throw new ForbiddenException('accept match');
		}
	}

	@Get('delete')
	async deleteMatch(@Session() session: Record<string, any>) {
		try {
			const del = await this.matchService.deleteMatch(session.passport.user.userid);
		} catch (error) {
			throw new ForbiddenException('delete match');
		}
	}

	@Get('making')
	async matchmaking(@Session() session: Record<string, any>) {
		try {
			const match = await this.matchService.matchmaking(session.passport.user.userid);
			return {"msg" : "ok" };
		} catch (error) {
			throw new ForbiddenException('matchmaking');
		}
	}

}
