import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable ()
export class AuthService {
	constructor (private db: DbService) {}

	async signup(dto: AuthDto) {
		// const hash = await argon.hash(dto.pass);
		try {
			const user = await this.db.users.create({
				data: {
					userid: dto.user,
					username: dto.user,
				},
			})
			return user;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)	{
				if (error.code === 'P2002') {
					throw new ForbiddenException('user exists');
				}
			}
			throw error;
		}
	}

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