import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MatchService {
	constructor(private readonly db: DbService, private readonly userService: UserService) {}

	async listMatches() {
		const matchlist = await this.db.$queryRaw(
			Prisma.sql`SELECT matchid, ms.statusname FROM public.match_history
			LEFT JOIN public.match_status AS ms ON match_status=ms.statuscode;`
		);
		return matchlist;
	}

	async listMatch(userid: string) {
		const match = await this.db.$queryRaw(
			Prisma.sql`SELECT um.userid, um.matchid FROM public.user_match AS um
			LEFT JOIN public.match_history AS mh ON mh.matchid=um.matchid
			WHERE mh.match_status > 0 AND um.userid=${userid};`
		);
		return match;
	}

	async openMatch(userid: string, opponent?: string) {
		// try {
			var opp;
			if (opponent) {
				opp = await this.userService.getOne(opponent);
			}
			console.log("opponent", opponent);
			console.log("opp", opp);
			const already_open = await this.listMatch(userid);
			if (Object.keys(already_open).length == 0 && Object.keys(opp[0].userid).length != 1)
			{
				console.log("no open session - creating");
				const open = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.match_history (match_status)
					VALUES (2)
					RETURNING matchid;`
				);
				console.log("new matchid", open[0].matchid);
				// var timeout = (Date.now() / 1000) + 60;
				// console.log("settimeout", timeout);
				const join = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_match (userid, matchid)
					VALUES (${userid}, ${open[0].matchid});` //, to_timestamp(${timeout}));`
				);
				const join_opp = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_match (userid, matchid)
					VALUES (${opponent}, ${open[0].matchid});` //, to_timestamp(${timeout}));`
				);
			} else {
				throw new ForbiddenException();
			}
		// } catch (error) {
		// 	throw new ForbiddenException();
		// }
	}
}
