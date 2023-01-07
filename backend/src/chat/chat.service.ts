import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ChatService {
	constructor(private db: DbService) {}

	async listChats() {
		const list = await this.db.$queryRaw(
			Prisma.sql`SELECT chatid, chat_name, ct.typename
			FROM public.chat AS c
			LEFT JOIN public.chat_type as ct ON ct.typeid=c.type`
		);
		return list;
	}

	async joinChat(chatid: number, pw: string) {
		const result = await this.db.$queryRaw(
			Prisma.sql`SELECT COUNT(chatid) FROM public.chat
			WHERE chatid=CAST(${chatid} AS INTEGER)`
		);
		console.log(result[0].count);
	}
}
