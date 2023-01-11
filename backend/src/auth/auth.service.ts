import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Profile } from 'passport-42';
import { UserService } from '../user/user.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Injectable ()
export class AuthService {
	constructor (private db: DbService, private userService: UserService) {}

	async validateUser(profile: Profile) {
		var user;
		// console.log('User ', profile.username, ': searching');
		// const user = await this.db.users.findFirst({
		user = await this.findUser(profile.username);
		// ({
		// 	where: {
		// 		userid: profile.username,
		// 	}
		// });
		// console.log('User ', profile.username, ': checking');
		if (!user)
		{
			console.log('User ', profile.username, ' unknown, creating in DB');
			this.userService.createUser(profile);
		}
		user = await this.findUser(profile.username);
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

	// async signup(dto: AuthDto) {
	// 	// const hash = await argon.hash(dto.pass);
	// 	try {
	// 		const user = await this.db.users.create({
	// 			data: {
	// 				userid: dto.user,
	// 				username: dto.user,
	// 			},
	// 		})
	// 		return user;
	// 	} catch (error) {
	// 		if (error instanceof PrismaClientKnownRequestError)	{
	// 			if (error.code === 'P2002') {
	// 				throw new ForbiddenException('user exists');
	// 			}
	// 		}
	// 		throw error;
	// 	}
	// }


	// async login(dto: AuthDto) {
	// 	const user = await this.db.users.findFirst({
	// 		where: {
	// 			userid: dto.userid,
	// 		},
	// 	});
	// 	if (!user) 
	// 		throw new ForbiddenException('user does not exist');
	// 	return user;
	// }

}