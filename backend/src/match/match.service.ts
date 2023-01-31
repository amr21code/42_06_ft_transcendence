import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';
import { MatchGameStateDto } from './dto/matchgamestate.dto';

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

	async listActiveMatch(userid: string) {
		const matchid = await this.db.$queryRaw(
			Prisma.sql`SELECT um.matchid FROM public.user_match AS um
			LEFT JOIN public.match_history AS mh ON um.matchid=mh.matchid
			WHERE userid=${userid} AND mh.match_status>0;`
		);
		return matchid;
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

	// matchStatus = 2 -> queue
	async listMatchQueue(userid: string) {
		const match = await this.db.$queryRaw(
			Prisma.sql`SELECT um.userid, um.matchid FROM public.user_match AS um
			LEFT JOIN public.match_history AS mh ON mh.matchid=um.matchid
			WHERE mh.match_status > 0 AND um.userid=${userid} AND um.challenge=2;`
		);
		return match;
	}

	// matchStatus = 2 -> queue
	async listMatch(userid: string) {
		const match = await this.db.$queryRaw(
			Prisma.sql`SELECT um.userid, um.matchid FROM public.user_match AS um
			LEFT JOIN public.match_history AS mh ON mh.matchid=um.matchid
			WHERE mh.match_status > 0 AND um.userid=${userid};`
		);
		return match;
	}

	async showHistory(userid: string) {
		const match = await this.db.$queryRaw(
			Prisma.sql`SELECT mh.matchid, mh.match_status, u1.username as user1, um1.user_score as user1_score, um2.username as user2, um2.user_score AS user2_score  FROM public.user_match as um1
			LEFT JOIN public.users AS u1 ON um1.userid=u1.userid
			LEFT JOIN (SELECT um.userid, u2.username, um.matchid, um.user_score FROM public.user_match as um
			LEFT JOIN public.users AS u2 ON um.userid=u2.userid) AS um2 ON um1.matchid=um2.matchid AND um1.userid<>um2.userid
			LEFT JOIN public.match_history AS mh ON mh.matchid=um1.matchid
			WHERE mh.match_status=0 AND um1.userid=${userid};`
		);
		return match;
	}

	async openSingleMatch(userid: string, status: number){
		console.log("singleMatch");
		const already_open = await this.listMatch(userid);
		if (Object.keys(already_open).length == 0)
		{
			console.log("no open session - creating");
			const open = await this.db.$queryRaw(
				Prisma.sql`INSERT INTO public.match_history (match_status)
				VALUES (1)
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
			} 
			console.log(open[0].matchid);
			return (open[0].matchid);
		}else {
			throw new ForbiddenException();
		}
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
				if (open[0].matchid) {
					const join = await this.db.$queryRaw(
						Prisma.sql`INSERT INTO public.user_match (userid, matchid, challenge)
						VALUES (${userid}, ${open[0].matchid}, ${status})
						RETURNING matchid;` //, to_timestamp(${timeout}));`do
					);
					if (opponent) {	
						console.log("join: ", join);
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

	//async matchmakingUnsafe(userid: string) {
	//	try {
	//			const open_matches = await this.listMatchesStatus(2);
	//			if (Object.keys(open_matches).length == 0) {
	//				return this.openMatch(userid, 2);
	//			} else {
	//				return this.join(userid, open_matches[0].matchid);
	//			}
	//		}
	//	catch (error) {
	//		throw new ForbiddenException('possible db error');
	//	}
	//}

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
			WHERE matchid=(SELECT um.matchid from public.match_history AS mh LEFT JOIN public.user_match AS um ON mh.matchid=um.matchid
				WHERE mh.match_status > 0 AND um.userid=${userid}) AND userid=${userid}
			RETURNING matchid;`);
		console.log("ACCEPTMATCH: matchid:", accept);
		const matchstatus = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.match_history SET match_status=1 WHERE matchid=${accept[0].matchid};`
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
			WHERE matchid=(SELECT um.matchid FROM public.user_match AS um
			LEFT JOIN public.match_history AS mh ON mh.matchid=um.matchid
			WHERE mh.match_status > 0 AND um.userid=${userid});`
		);
	}

	async getOpponentStatus(matchid: number, userid: string){
		const accept = await this.db.$queryRaw(
			Prisma.sql`SELECT challenge FROM public.user_match
			WHERE matchid=${matchid} AND userid!=${userid};`
		);
		console.log("Accept returns: ", accept);
		if (accept[0] && accept[0].challenge > 0)
			return true;
		else 
			return false;
	}

	async updateMatch(matchid: any, state: MatchGameStateDto) { //update userscore, match_status, wins/losses
		try{
			console.log("update match");
			console.log(matchid, state);
			var winner, loser;
			await this.db.$queryRaw(
			Prisma.sql`UPDATE public.user_match SET user_score=CAST(${state.scorePlayer1} AS INTEGER)
			WHERE matchid=${matchid} AND userid=${state.player1.userid};`);
			await this.db.$queryRaw(
			Prisma.sql`UPDATE public.user_match SET user_score=CAST(${state.scorePlayer2} AS INTEGER)
			WHERE matchid=${matchid} AND userid=${state.player2.userid};`);
			if (state.scorePlayer1 == 3) {
				winner = state.player1.userid;
				loser = state.player2.userid;
			} else {
				winner = state.player2.userid;
				loser = state.player1.userid;
			}
			// begin winner update
			console.log("win", winner);
			var win = await this.db.$queryRaw<number>(
			Prisma.sql`SELECT wins FROM public.users WHERE userid=${winner};`);
			win[0].wins = win[0].wins + 1;
			await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET wins=CAST(${win[0].wins} AS INTEGER)
				WHERE userid=${winner}`);
			// end winner update
			// begin loser update
			var loss= await this.db.$queryRaw<number>(
				Prisma.sql`SELECT losses FROM public.users WHERE userid=${loser};`);
			loss[0].losses = loss[0].losses + 1;
			console.log("loss");
			await this.db.$queryRaw(
					Prisma.sql`UPDATE public.users SET losses=CAST(${loss[0].losses} AS INTEGER)
					WHERE userid=${loser}`);
			// end loser update
			
			const match = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.match_history SET match_status=0
				WHERE matchid=${matchid}`);
		} catch (error) {
			throw new ForbiddenException();
		}
	}


}
