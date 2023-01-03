import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AuthDto } from './dto';
import { Profile } from 'passport';

@Injectable ()
export class AuthService {
	constructor (private db: DbService) {}

	async validateUser(profile: Profile) {
		console.log('User ', profile.username, ': searching');
		const user = await this.db.users.findFirst({
			where: {
				userid: profile.username,
			}
		});
		console.log('User ', profile.username, ': checking');
		if (!user)
		{
			console.log('User ', profile.username, ' unknown, creating in DB');
			const user = await this.db.users.create({
				data: {
					userid: profile.username,
					username: profile.name.givenName,
				},
			})
		}
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

	async findUser(userid: string)
	{
		const user = await this.db.users.findFirst({
			where: {
				userid: userid,
			}
		});
		return user;
	}

	async login(dto: AuthDto) {
		const user = await this.db.users.findFirst({
			where: {
				userid: dto.user,
			},
		});
		if (!user) 
			throw new ForbiddenException('user does not exist');
		return user;
	}

}