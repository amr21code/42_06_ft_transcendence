import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from '../db/db.service';

@Injectable()
export class FriendlistService {
	constructor (private db: DbService) {}

	async showFL(userid: string) {
		const user = await this.db.$queryRaw(
			Prisma.sql`(SELECT fl.addresseeid as userid, ua.username as username, os.statusname, fc.statusname as friendstatus
				FROM public.friends as fl
				LEFT JOIN public.friendship_codes as fc ON fc.statuscode = fl.statuscode
				LEFT JOIN public.users as ua ON fl.addresseeid = ua.userid
				LEFT JOIN public.online_status as os ON os.statuscode=ua.user_status
				WHERE fl.requesterid=${userid})
				UNION
				(SELECT fl.requesterid as friendid, ur.username as friendname, os.statusname, fc.statusname as status
				FROM public.friends as fl
				LEFT JOIN public.friendship_codes as fc ON fc.statuscode = fl.statuscode
				LEFT JOIN public.users as ur ON fl.requesterid = ur.userid
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
			// console.log(request);
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
			// console.log(request);
			return request;
		} else if (action === 'block') {
			// console.log('count', count[0].count);
			if (count[0].count > 0) {
				throw new ForbiddenException();
			}
			const request = await this.db.$queryRaw(
				Prisma.sql`INSERT INTO public.friends(
					requesterid, addresseeid, statuscode)
					VALUES (${userid}, ${userid_other}, 2);`
			);
			// console.log(request);
			return request;
		} else if (action === 'unblock') {
			// console.log('count unblock', count[0].count);
			if (count[0].count == 0) {
				throw new ForbiddenException();
			}
			const request = await this.db.$queryRaw(
				Prisma.sql`DELETE FROM public.friends
				WHERE requesterid=${userid} AND addresseeid=${userid_other} AND statuscode='2';`
			);
			// console.log(request);
			return request;
		} else if (action === 'remove') {
			// console.log('count remove', count[0].count);
			if (count[0].count == 0) {
				throw new ForbiddenException();
			}
			const request = await this.db.$queryRaw(
				Prisma.sql`DELETE FROM public.friends
				WHERE ((requesterid=${userid} AND addresseeid=${userid_other}) 
				OR (requesterid=${userid_other} AND addresseeid=${userid})) 
				AND (statuscode='1' OR statuscode='0');`
			);
			// console.log(request);
			return request;
		}
	}
}
