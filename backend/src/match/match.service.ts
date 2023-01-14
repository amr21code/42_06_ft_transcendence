import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Prisma } from '@prisma/client';
import { threadId } from 'worker_threads';

@Injectable()
export class MatchService {
	constructor(private readonly db: DbService) {}

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

	async openMatch(userid: string) {
		try {
			const already_open = await this.listMatch(userid);
			if (Object.keys(already_open).length == 0)
			{
				const open = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.match_history (match_status)
					VALUES (2)
					RETURNING matchid;`
				);
				var timeout = (Date.now() / 1000) + 60;
				const join = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_match (userid, matchid, timeout)
					VALUES (${userid}, ${open[0].matchid}, CAST(${timeout} AS INTEGER));`
				);
			} else {
				throw new ForbiddenException();
			}
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}
