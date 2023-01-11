import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from '../db/db.service';

@Injectable()
export class AchievementsService {
	constructor (private db: DbService) {}

	async showAchieve(userid: string) {
		const achievements = await this.db.$queryRaw(
			Prisma.sql`SELECT a.achievementname AS Name, a.achievementdescription AS Description, ua.count AS Count FROM public.users_achievements AS ua
			LEFT JOIN public.users AS u ON ua.userid=u.userid
			LEFT JOIN public.achievements AS a ON ua.achievementid=a.achievementid
			WHERE ua.userid=${userid}`
		);
		return achievements;
	}

	async addAchieve(userid: string, achid: string) {
		const result = await this.db.$queryRaw(
			Prisma.sql`SELECT COUNT(id) FROM public.users_achievements
			WHERE userid=${userid} AND achievementid=CAST(${achid} AS INTEGER)`
			);
		// console.log("test", result[0].count);
		if (result[0].count == 0) {
			// console.log("test1");
			const achievements = await this.db.$queryRaw(
				Prisma.sql`INSERT INTO public.users_achievements(
					userid, achievementid, count)
					VALUES (${userid}, CAST(${achid} AS INTEGER), 1);`
			);
		}
		else if (result[0].count == 1)
		{
			// console.log("test2");
			var count = await this.db.$queryRaw(
				Prisma.sql`SELECT count FROM public.users_achievements
				WHERE userid=${userid} AND achievementid=CAST(${achid} AS INTEGER)`
			);
			count[0].count++;
			// console.log('count', count[0].count);
			const achievements = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users_achievements
				SET count=CAST(${count[0].count} AS INTEGER)
				WHERE userid=${userid} AND achievementid=CAST(${achid} AS INTEGER);`
			);
		}
		return achid;
	}
}
