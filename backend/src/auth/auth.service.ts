import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Profile } from 'passport-42';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';

@Injectable ()
export class AuthService {
	constructor (private db: DbService, private userService: UserService) {}

	async validateUser(profile: Profile, accessToken: string) {
		var user;
		user = await this.findUser(profile.username);
		if (!user)	{
			console.log('User ', profile.username, ' unknown, creating in DB');
			this.userService.createUser(profile, accessToken);
			user = await this.findUser(profile.username);
		} else {
			await this.db.$queryRaw(
				Prisma.sql`UPDATE public.users
				SET access_token=${accessToken} 
				WHERE userid=${user.userid};`
			);
			user = await this.findUser(profile.username);
		}
		return user;
	}

	async findUser(userid: string)
	{
		const user = await this.db.users.findFirst({
			where: {
				userid: userid,
			}
		});
		return user;
	}
}