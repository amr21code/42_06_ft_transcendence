import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Profile } from 'passport-42';
import { DbService } from '../db/db.service';
import { AchievementsService } from 'src/achievements/achievements.service';

@Injectable()
export class UserService {
	constructor (private db: DbService, private readonly achieve: AchievementsService) {}

	async getAll() {
		const user = await this.db.$queryRaw(
			Prisma.sql`select userid, username, 
			CASE 
			WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL 
			THEN profilepic42 
			WHEN avatar=2
			THEN (SELECT concat(avatarurl, userid, '.png') as picurl FROM public.avatars as av WHERE avatar=av.avatarid)
			ELSE (select avatarurl from public.avatars where avatarid = avatar) 
			END as picurl,created, statusname, wins, losses, paddlecolor FROM public.users
			LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
			LEFT JOIN public.avatars as A ON users.avatar = A.avatarid
			ORDER BY wins DESC, losses ASC, created ASC`
			);
		return (user);
	}

	async getLeaderboardPos(userid: string){
		const pos = await this.db.$queryRaw<number>(
			Prisma.sql`SELECT row_num FROM 
			(SELECT ROW_NUMBER() OVER() AS row_num, userid FROM public.users ORDER BY wins DESC, losses ASC, created ASC) as leaderboard WHERE userid=${userid}`
		);
		console.log("leader pos", pos);
		if (Object.keys(pos).length == 0)
			return (0);
		else
			return (pos[0].row_num);
	}

	async getMe(user: any) {
		const meuser = await this.db.$queryRaw(
			Prisma.sql`SELECT userid, username, 
			CASE
				WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL THEN 
				profilepic42 
				WHEN avatar=2
					THEN (SELECT concat(avatarurl, userid, '.png') as picurl FROM public.avatars as av WHERE avatar=av.avatarid)
				ELSE (select avatarurl from public.avatars where avatarid = avatar) 
				END as picurl, 
				created, statusname, wins, losses, profilepic42, paddlecolor from public.users
			LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
			LEFT JOIN public.avatars as A ON users.avatar = A.avatarid
			WHERE userid=${user.userid}`
			);
		return (meuser);
	}

	async getOne(userid: string) {
		const user = await this.db.$queryRaw(
			Prisma.sql`SELECT userid, username, 
			CASE 
				WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL THEN 
				profilepic42 
				WHEN avatar=2
					THEN (SELECT concat(avatarurl, userid, '.png') as picurl FROM public.avatars as av WHERE avatar=av.avatarid)
				ELSE (select avatarurl from public.avatars where avatarid = avatar) 
				END as picurl, 
				created, statusname, wins, losses, paddlecolor from public.users
			LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
			LEFT JOIN public.avatars as A ON users.avatar = A.avatarid
			WHERE userid=${userid}`
			);
		return (user);
	}

	async createUser(profile: Profile, accessToken: string) {
		const user = await this.db.users.create({
			data: {
				userid: profile.username,
				username: profile.name.givenName,
				avatar: 42,
				profilepic42: profile._json.image.versions.small,
				access_token: accessToken,
			},
		})
		return user;
	}

	async changeUserData(userid: string, field: string, newdata: any)
	{
		// console.log("data", newdata);
		if (field == 'username') {
			const find = await this.db.$queryRaw(
				Prisma.sql`SELECT COUNT(*) FROM public.users WHERE username=${newdata}`);
			//console.log(find);
			if (find[0].count == 0){
				console.log("changing username")
				const status = await this.db.$queryRaw(
					Prisma.sql`UPDATE public.users SET username=${newdata} WHERE userid=${userid}`
					);
				if (newdata === 'GuillaumeCalvi') {
					this.achieve.addAchieve(userid, 2);
				}
			} else {
				console.log("username already taken");
			}
		} else if (field == 'user_status'){
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET user_status=CAST(${newdata} AS INTEGER) WHERE userid=${userid}`
				);
		} else if (field == 'twofa') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET twofa=CAST(${newdata} AS INTEGER) WHERE userid=${userid}`
				);
		} else if (field == 'avatar') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET avatar=CAST(${newdata} AS INTEGER) WHERE userid=${userid}`
				);
		}else if (field == 'twofa') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET twofa=CAST(${newdata} AS INTEGER) WHERE userid=${userid}`
				);
		}else if (field == 'twofasecret') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET twofasecret=${newdata} WHERE userid=${userid}`
				);
		}else if (field == 'socket_token') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET socket_token=${newdata} WHERE userid=${userid}`
				);
		}else if (field == 'paddlecolor') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET paddlecolor=${newdata} WHERE userid=${userid}`
				);
		}
	}

	async getUserData(userid: string, field: string) : Promise<any>
	{
		var status = userid;
		if (field == 'username') {
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT username FROM public.users WHERE userid=${userid}`
				);
		} else if (field == 'user_status'){
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT user_status FROM public.users WHERE userid=${userid}`
				);
		} else if (field == 'wins') {
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT wins FROM public.users WHERE userid=${userid}`
				);
		} else if (field == 'losses') {
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT losses FROM public.users WHERE userid=${userid}`
				);
		} else if (field == 'avatar') {
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT avatar FROM public.users WHERE userid=${userid}`
				);
		}else if (field == 'twofa') {
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT twofa FROM public.users WHERE userid=${userid}`
				);
		}else if (field == 'twofasecret') {
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT twofasecret FROM public.users WHERE userid=${userid}`
				);
		}else if (field == 'socket_token') {
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT socket_token FROM public.users WHERE userid=${userid}`
				);
		}else if (field == 'paddlecolor') {
			status = await this.db.$queryRaw(
				Prisma.sql`SELECT paddlecolor FROM public.users WHERE userid=${userid}`
				);
		}
		return status;
	}

	async updateWinsLosses(userid: string, wl: string) {
		var WinOrLossNumber = Number(this.getUserData(userid, wl)) + 1;
		if (wl == 'wins') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET wins=${WinOrLossNumber} WHERE userid=${userid}`
			);
		} else if (wl == 'losses') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET losses=${WinOrLossNumber} WHERE userid=${userid}`
			);
		}
	}

	async showUserRelationshipStatus(userid1: string, userid2: string) {
		const user = await this.db.$queryRaw(
			Prisma.sql`(SELECT fl.statuscode
				FROM public.friends as fl
				LEFT JOIN public.friendship_codes as fc ON fc.statuscode = fl.statuscode
				LEFT JOIN (SELECT userid, username, user_status,  
					CASE 
						WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL THEN 
						profilepic42 
						ELSE (select avatarurl from public.avatars where avatarid = avatar) 
						END as picurl, 
						created, statusname from public.users
						LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
						LEFT JOIN public.avatars as A ON users.avatar = A.avatarid) as ua ON fl.addresseeid = ua.userid
				LEFT JOIN public.online_status as os ON os.statuscode=ua.user_status
				WHERE fl.requesterid=${userid1} AND fl.addresseeid=${userid2})
				UNION
				(SELECT fl2.statuscode
				FROM public.friends as fl2
				LEFT JOIN public.friendship_codes as fc ON fc.statuscode = fl2.statuscode
				LEFT JOIN (SELECT userid, username, user_status,  
					CASE 
						WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL THEN 
						profilepic42 
						ELSE (select avatarurl from public.avatars where avatarid = avatar) 
						END as picurl, 
						created, statusname from public.users
						LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
						LEFT JOIN public.avatars as A ON users.avatar = A.avatarid) as ur ON fl2.requesterid = ur.userid
				LEFT JOIN public.online_status as os ON os.statuscode=ur.user_status
				WHERE fl2.addresseeid=${userid1} AND fl2.requesterid=${userid2})`
				);
				// console.log(user[0].statuscode);
		return (user);
	}

}
