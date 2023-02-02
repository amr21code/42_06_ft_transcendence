import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from '../db/db.service';

@Injectable()
export class FriendlistService {
	constructor (private db: DbService) {}

	async showFL(userid: string) {
		const user = await this.db.$queryRaw(
			Prisma.sql`(SELECT fl.addresseeid as userid, fl.addresseeid, ua.username as username, os.statusname, fc.statusname as friendstatus, ua.picurl
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
				WHERE fl.requesterid=${userid})
				UNION
(SELECT fl.requesterid as friendid, fl.addresseeid, ur.username as friendname, os.statusname, fc.statusname as friendstatus, ur.picurl
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
						LEFT JOIN public.avatars as A ON users.avatar = A.avatarid) as ur ON fl.addresseeid = ur.userid
				LEFT JOIN public.online_status as os ON os.statuscode=ur.user_status
				WHERE addresseeid=${userid})`
				);
		return (user);
	}

	async changeStatus(userid: string, userid_other: string, action: string) {
		const count = await this.db.$queryRaw(
			Prisma.sql`SELECT COUNT(statuscode)
			FROM public.friends
			WHERE (requesterid=${userid} AND addresseeid=${userid_other}) OR (requesterid=${userid_other} AND addresseeid=${userid})`
		) as number;
		if (action === 'request') {
			if (count[0].count > 0) {
				throw new ForbiddenException();
			}
			const request = await this.db.$queryRaw(
				Prisma.sql`INSERT INTO public.friends(
					requesterid, addresseeid, statuscode)
					VALUES (${userid}, ${userid_other}, 0);`
			);
			return request;
		} else if (action === 'confirm') {
			if (count[0].count == 0) {
				throw new ForbiddenException();
			}
			const request = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.friends
				SET statuscode=1
				WHERE (requesterid=${userid_other} AND addresseeid=${userid});`
				);
			return request;
		} else if (action === 'block') {
			if (count[0].count > 0) {
				throw new ForbiddenException();
			}
			const request = await this.db.$queryRaw(
				Prisma.sql`INSERT INTO public.friends(
					requesterid, addresseeid, statuscode)
					VALUES (${userid}, ${userid_other}, 2);`
			);
			return request;
		} else if (action === 'unblock') {
			if (count[0].count == 0) {
				throw new ForbiddenException();
			}
			const request = await this.db.$queryRaw(
				Prisma.sql`DELETE FROM public.friends
				WHERE requesterid=${userid} AND addresseeid=${userid_other} AND statuscode='2';`
			);
			return request;
		} else if (action === 'remove') {
			if (count[0].count == 0) {
				throw new ForbiddenException();
			}
			const request = await this.db.$queryRaw(
				Prisma.sql`DELETE FROM public.friends
				WHERE ((requesterid=${userid} AND addresseeid=${userid_other}) 
				OR (requesterid=${userid_other} AND addresseeid=${userid})) 
				AND (statuscode='1' OR statuscode='0');`
			);
			return request;
		}
	}
}
