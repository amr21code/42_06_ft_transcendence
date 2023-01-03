import { Injectable } from '@nestjs/common';
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
				twofa: true,
				status: true,
				created: true,
			}
		});
		console.log(user);
		return (user);
	}

	async getOne(userid: string) {
		const user = await this.db.users.findUnique({
			where: {
				userid: userid,
			},
			include: {
				
			}
		});
		console.log(user);
		return (user);
	}
}
