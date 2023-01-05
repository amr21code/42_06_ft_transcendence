import { Injectable, Req } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Profile } from 'passport-42';
import { DbService } from 'src/db/db.service';
import { UserDet } from './types';

@Injectable()
export class UserService {
	constructor (private db: DbService) {}

	async getAll() {
		const user = await this.db.$queryRaw(
			Prisma.sql`select userid, username, CASE WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL THEN profilepic42 ELSE (select avatarurl from public.avatars where avatarid = avatar) END as picurl,created, statusname from public.users
			LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
			LEFT JOIN public.avatars as A ON users.avatar = A.avatarid`
			);
		// const user = await this.db.users.findMany({
		// 	select: {
		// 		userid: true,
		// 		username: true,
		// 		avatar: true,
		// 		// twofa: true,
		// 		online_status: {
		// 			select: {
		// 				statusname: true,
		// 			}
		// 		},
		// 		created: true,
		// 	}
		// });
		console.log(user);
		return (user);
	}

	async getMe(user: any) {
		console.log("getme", user);
		const meuser = await this.db.$queryRaw(
			Prisma.sql`SELECT userid, username, 
			CASE 
				WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL THEN 
				profilepic42 
				ELSE (select avatarurl from public.avatars where avatarid = avatar) 
				END as picurl, 
				created, statusname from public.users
			LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
			LEFT JOIN public.avatars as A ON users.avatar = A.avatarid
			WHERE userid=${user.userid}`
			);
		// const resuser = await this.db.users.findUnique({
		// 	where: {
		// 		userid: user.userid,
		// 	},
		// 	select: {
		// 		userid: true,
		// 		username: true,
		// 		avatar: true,
		// 		twofa: true,
		// 		created: true,
		// 		online_status: {
		// 			select: {
		// 				statusname: true,
		// 			}
		// 		}
		// 	}
		// });
		// console.log(meuser);
		return (meuser);
	}

	async getOne(userid: string) {
		const user = await this.db.$queryRaw(
			Prisma.sql`SELECT userid, username, 
			CASE 
				WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL THEN 
				profilepic42 
				ELSE (select avatarurl from public.avatars where avatarid = avatar) 
				END as picurl, 
				created, statusname from public.users
			LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
			LEFT JOIN public.avatars as A ON users.avatar = A.avatarid
			WHERE userid=${userid}`
			);
		console.log(user);
		return (user);
	}

	async getProfileID(userid: string) {
		const profileid = await this.db.users.findUnique({
			where: {
				userid: userid,
			},
			select: {
				avatar: true,
			}
		});
		// console.log(profileid);
		return profileid;
	}

	async createUser(profile: Profile) {
		const user = await this.db.users.create({
			data: {
				userid: profile.username,
				username: profile.name.givenName,
				avatar: 42,
				profilepic42: profile._json.image.versions.small,
			},
		})
		return user;
	}



	// async getUserData(userid: string, field: string, newdata: any)
	// {
	// 	if (field == 'username') {
	// 		const status = await this.db.$queryRaw(
	// 			Prisma.sql`UPDATE public.users SET username=${newdata} WHERE userid=${userid}`
	// 			);
	// 	} else if (field == 'user_status'){
	// 		const status = await this.db.$queryRaw(
	// 			Prisma.sql`UPDATE public.users SET user_status=CAST(${newdata} AS INTEGER) WHERE userid=${userid}`
	// 			);
	// 	} else if (field == 'twofa') {
	// 		const status = await this.db.$queryRaw(
	// 			Prisma.sql`UPDATE public.users SET twofa=CAST(${newdata} AS INTEGER) WHERE userid=${userid}`
	// 			);
	// 	} else if (field == 'avatar') {
	// 		const status = await this.db.$queryRaw(
	// 			Prisma.sql`UPDATE public.users SET avatar=CAST(${newdata} AS INTEGER) WHERE userid=${userid}`
	// 			);
	// 	}
	// }

	async changeUserData(userid: string, field: string, newdata: any)
	{
		if (field == 'username') {
			const status = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users SET username=${newdata} WHERE userid=${userid}`
				);
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
		}
	}
}
