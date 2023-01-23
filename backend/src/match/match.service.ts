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

	async listMatchesStatus(status: number) {
		const matchlist = await this.db.$queryRaw(
			Prisma.sql`SELECT mh.matchid, ms.statusname, um.players FROM public.match_history AS mh
			LEFT JOIN public.match_status AS ms ON mh.match_status=ms.statuscode
			LEFT JOIN (SELECT COUNT(userid) AS players, matchid FROM public.user_match GROUP BY matchid) AS um ON um.matchid=mh.matchid
			WHERE mh.match_status=CAST(${status} AS INTEGER);`
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

	async openMatch(userid: string, status: number, opponent?: string) {
		try {
			var opp;
			if (opponent) {
				opp = await this.userService.getOne(opponent);
				console.log('opp in if', opp);
				const opp_open = await this.listMatch(opp[0].userid);
				if (Object.keys(opp).length != 1 || Object.keys(opp_open).length != 0)
				throw new ForbiddenException();
			}
			console.log("opponent", opponent);
			console.log("opp", opp);
			const already_open = await this.listMatch(userid);
			if (Object.keys(already_open).length == 0)
			{
				console.log("no open session - creating");
				const open = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.match_history (match_status)
					VALUES (2)
					RETURNING matchid;`
				);
				// console.log("new matchid", open[0].matchid);
				// var timeout = (Date.now() / 1000) + 60;
				// console.log("settimeout", timeout);
				if (open[0].matchid) {
					const join = await this.db.$queryRaw(
						Prisma.sql`INSERT INTO public.user_match (userid, matchid, challenge)
						VALUES (${userid}, ${open[0].matchid}, ${status})
						RETURNING matchid;` //, to_timestamp(${timeout}));`
					);
					if (opponent) {
						if (join[0].matchid) {
							const join_opp = await this.db.$queryRaw(
								Prisma.sql`INSERT INTO public.user_match (userid, matchid)
								VALUES (${opponent}, ${open[0].matchid});` //, to_timestamp(${timeout}));`
								);
						} else {
							this.deleteMatchID(open[0].matchid);
							throw new ForbiddenException();
						}
					}
				} else {
					throw new ForbiddenException();
				}
				return (open[0].matchid);
			} else {
				throw new ForbiddenException();
			}
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	async matchmaking(userid: string) {
		try {
			const already_open = await this.listMatch(userid);
			if (Object.keys(already_open).length == 0) {
				const open_matches = await this.listMatchesStatus(2);
				if (Object.keys(open_matches).length == 0) {
					return this.openMatch(userid, 2);
				} else {
					return this.join(userid, open_matches[0].matchid);
				}
			} else {
				throw new ForbiddenException('user already in a match');
			}
		} catch (error) {
			throw new ForbiddenException('possible db error');
		}
	}

	async join(userid: string, matchid: number) {
		const join = await this.db.$queryRaw(
			Prisma.sql`INSERT INTO public.user_match (userid, matchid, challenge)
			VALUES (${userid}, ${matchid}, 1)
			RETURNING matchid`
		);
		if (join[0].matchid == matchid) {
			const opponent = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.user_match SET challenge=1 WHERE matchid=${matchid} AND userid=${userid};`
			);
			const matchstatus = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.match_history SET match_status=1 WHERE matchid=${matchid};`
			);
		}
		return join;
	}

	async acceptMatch(userid: string) {
		const accept = await this.db.$queryRaw(
			Prisma.sql`UPDATE public.user_match
			SET challenge=1
			WHERE userid=${userid};`
		);
	}

	async deleteMatchID(matchid: string) {
		const accept = await this.db.$queryRaw(
			Prisma.sql`DELETE FROM public.match_history
			WHERE matchid=${matchid};`
		);
	}

	async deleteMatch(userid: string) {
		const accept = await this.db.$queryRaw(
			Prisma.sql`DELETE FROM public.match_history
			WHERE matchid=(SELECT matchid FROM public.user_match WHERE userid=${userid} AND challenge!=3);`
		);
	}
	async getOpponentStatus(matchid: number, userid: string){
		const accept = await this.db.$queryRaw(
			Prisma.sql`SELECT challenge FROM public.user_match
			WHERE matchid=${matchid} AND userid!=${userid};`
			//Prisma.sql`SELECT mh.matchstatus FROM public.user_match
			//LEFT JOIN public.match_history AS mh ON user_match.matchid=mh.matchid
			//WHERE matchid=${matchid} AND userid!=${userid};`
		);
		if (accept[0].challenge == 1)
			return true;
		else 
			return false;
	}
}
