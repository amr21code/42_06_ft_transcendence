import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient {
	constructor(config: ConfigService) {
		super({
			datasources: {
				db: {
					url: config.get("DATABASE_URL"),
				},
			},
		});
	}

	cleanDb() {
		this.chat.deleteMany();
		this.chat_messages.deleteMany();
		this.friends.deleteMany();
		this.match_history.deleteMany();
		this.user_chat.deleteMany();
		this.user_match.deleteMany();
		this.users.deleteMany();
		this.users_achievements.deleteMany();
		this.userstats.deleteMany();
	}
}
