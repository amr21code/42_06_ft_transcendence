import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ChatService {
	constructor(private db: DbService) {}

	async listChats(userid?: string) {
		var list;
		if (userid) {
			list = await this.db.$queryRaw(
				Prisma.sql`SELECT uc.userid, usc.statusname, c.chatid, c.chat_name, ct.typename, password
				FROM public.user_chat AS uc
				LEFT JOIN public.user_status_chat as usc ON uc.status=usc.statusid
				LEFT JOIN public.chat as c ON uc.chatid=c.chatid
				LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
				WHERE uc.userid=${userid}
				ORDER BY chatid ASC`
			);
		} else {
			list = await this.db.$queryRaw(
				Prisma.sql`SELECT chatid, chat_name, ct.typename
				FROM public.chat AS c
				LEFT JOIN public.chat_type as ct ON ct.typeid=c.type`
			);
		}
		return list;
	}

	async listUsers(chatid?: number) {
		var list;
		if (chatid) {
			list = await this.db.$queryRaw(
				Prisma.sql`SELECT uc.userid, usc.statusname, c.chatid, c.chat_name, ct.typename, password
				FROM public.user_chat AS uc
				LEFT JOIN public.user_status_chat as usc ON uc.status=usc.statusid
				LEFT JOIN public.chat as c ON uc.chatid=c.chatid
				LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
				WHERE uc.chatid=CAST(${chatid} AS INTEGER)
				ORDER BY userid ASC`
			);
		} else {
			list = await this.db.$queryRaw(
				Prisma.sql`SELECT uc.userid, usc.statusname, c.chatid, c.chat_name, ct.typename, password
				FROM public.user_chat AS uc
				LEFT JOIN public.user_status_chat as usc ON uc.status=usc.statusid
				LEFT JOIN public.chat as c ON uc.chatid=c.chatid
				LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
				ORDER BY userid ASC`
			);
		}
		return list;
	}

	async joinChat(userid: string, chatid: number, pw: string) {
		const result = await this.db.$queryRaw(
			Prisma.sql`SELECT chatid, password FROM public.chat
			WHERE chatid=CAST(${chatid} AS INTEGER)`
		);
		console.log(result);
		try {
			if (result[0].chatid == chatid && pw == result[0].password) {
				// console.log("chat exists, password is correct, joining");
				const join = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_chat(
						userid, chatid, status)
						VALUES (${userid}, CAST(${chatid} AS INTEGER), 1);`
						);
				return ({msg: 'ok'});
			}
		} catch (error) {
			// console.log("chat does not exist or pw is wrong");
			try {
				console.log("chat does not exist, creating a new one and joining");
				var chatname = 'public chat by ' + userid;
				const create = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.chat(type, chat_name, password)
					VALUES (0, ${chatname}, ${pw})
					RETURNING chatid;`
				);
				const join = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_chat(
						userid, chatid, status) 
						VALUES (${userid}, CAST(${create[0].chatid} AS INTEGER), 0);`
				);
				return ({msg: 'ok'});
			} catch (error) {
				// console.log("error: wrong pw");
				throw new ForbiddenException();
			}
		}
	}

	async leaveChat(userid: string, chatid: number) {
		const result = await this.listUsers(chatid);
		var size = Object.keys(result).length;
		if (size == 1) {
			console.log("deleting chat");
			const del = await this.db.$queryRaw(
				Prisma.sql`DELETE FROM public.chat
				WHERE chatid=CAST(${chatid} AS INTEGER);`
			);
		} else if (size > 1) {
			console.log("leaving");
			const del = await this.db.$queryRaw(
				Prisma.sql`DELETE FROM public.user_chat
				WHERE chatid=CAST(${chatid} AS INTEGER) AND userid=${userid};`
			);
		}
		return size;
	}
}
