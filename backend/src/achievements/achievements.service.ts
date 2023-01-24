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

	async addAchieve(userid: string, achid: number) {
		const result = await this.db.$queryRaw(
			Prisma.sql`SELECT * FROM public.users_achievements
			WHERE userid=${userid} AND achievementid=CAST(${achid} AS INTEGER)`
			);
		if (Object.keys(result).length == 0) {
			const achievements = await this.db.$queryRaw(
				Prisma.sql`INSERT INTO public.users_achievements(
					userid, achievementid, count)
					VALUES (${userid}, CAST(${achid} AS INTEGER), 1);`
			);
		}
		else if (Object.keys(result).length == 1)
		{
			var count = await this.db.$queryRaw(
				Prisma.sql`SELECT count FROM public.users_achievements
				WHERE userid=${userid} AND achievementid=CAST(${achid} AS INTEGER)`
			);
			count[0].count++;
			const achievements = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users_achievements
				SET count=CAST(${count[0].count} AS INTEGER)
				WHERE userid=${userid} AND achievementid=CAST(${achid} AS INTEGER);`
			);
		}
		return achid;
	}
}
