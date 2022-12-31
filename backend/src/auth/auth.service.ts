import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UserDetails } from 'src/user/types';
import { Profile } from 'passport';

@Injectable ()
export class AuthService {
	constructor (private db: DbService) {}

	async validateUser(profile: Profile) {
		console.log('AuthService', profile.username);
		// try {
			const user = await this.db.users.findFirst({
				where: {
					userid: profile.username,
				}
			});
		if (!user)
		{
			const user = await this.db.users.create({
				data: {
					userid: profile.username,
					username: profile.name.givenName,
				},
			})
		}
		console.log(user);
		return user;
		// }
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


	async login(dto: AuthDto) {
		const user = await this.db.users.findUnique({
			where: {
				userid: dto.user,
			},
		});
		if (!user) 
			throw new ForbiddenException('user does not exist');
		return user;
	}

}