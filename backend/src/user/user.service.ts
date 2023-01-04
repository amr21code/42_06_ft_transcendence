import { Injectable, Req } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Profile } from 'passport-42';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UserService {
	constructor (private db: DbService) {}

	async getAll() {
		const user = await this.db.users.findMany({
			select: {
				userid: true,
				username: true,
				avatar: true,
				// twofa: true,
				online_status: {
					select: {
						statusname: true,
					}
				},
				created: true,
			}
		});
		console.log(user);
		return (user);
	}

	async getMe(user: any) {
		const resuser = await this.db.users.findUnique({
			where: {
				userid: user.userid,
			},
			select: {
				userid: true,
				username: true,
				avatar: true,
				twofa: true,
				created: true,
				online_status: {
					select: {
						statusname: true,
					}
				}
			}
		});
		console.log(resuser);
		return (resuser);
	}

	async getOne(userid: string) {
		const user = await this.db.users.findUnique({
			where: {
				userid: userid,
			},
			select: {
				userid: true,
				username: true,
				avatar: true,
				created: true,
				online_status: {
					select: {
						statusname: true,
					}
				}
			}
		});
		console.log(user);
		return (user);
	}

	async createUser(profile: Profile) {
		const user = await this.db.users.create({
			data: {
				userid: profile.username,
				username: profile.name.givenName,
				avatar: profile._json.image.versions.small,
			},
		})
		return user;
	}


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
		}
	}
}
