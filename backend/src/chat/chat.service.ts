import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { ChatMessageDto } from './dto';
import { MESSAGES } from '@nestjs/core/constants';
import { threadId } from 'worker_threads';
import { ChatDto } from './dto/chat.dto';
import { ChatUserStatusDto } from './dto/chatuserstatus.dto';

@Injectable()
export class ChatService {
	constructor(private db: DbService) {}

	async getUserStatus(userid: string, chatid: number) {
		const status = await this.db.$queryRaw(
			Prisma.sql`SELECT status
			FROM public.user_chat 
			WHERE chatid=CAST(${chatid} AS INTEGER) AND userid=${userid}`
		);
		return status;
	}

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
				LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
				WHERE c.type<2`
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
				WHERE c.type<2
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
				// console.log("chat does not exist, creating a new one and joining");
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

	async addMessage(message: ChatMessageDto) {
		const user = await this.db.$queryRaw(
			Prisma.sql`SELECT status FROM user_chat
			WHERE userid=${message.userid}`
		);
		if (user[0].status >= 2)
			throw new ForbiddenException();
		const msg = await this.db.$queryRaw(
			Prisma.sql`INSERT INTO public.chat_messages(
				userid, chatid, message)
				VALUES (${message.userid}, CAST(${message.chatid} AS INTEGER), ${message.message});`
		);
		return { msg : "ok" };
	}

	async listMessages(userid: string, chatid: string) {
		const list = await this.db.$queryRaw(
			Prisma.sql`SELECT u.username, cm.chatid, cm.message, cm.time, fl.statuscode
			FROM public.chat_messages AS cm
			LEFT JOIN public.users as u ON u.userid=cm.userid
			LEFT JOIN public.friends as fl ON cm.userid=fl.addresseeid AND fl.requesterid=${userid}
			WHERE chatid=CAST(${chatid} AS INTEGER) AND fl.statuscode IS DISTINCT FROM '2'
			ORDER BY cm.time ASC`
		);
		return list;
	}

	async changeChatDetails(details: ChatDto) {
		const result = await this.db.$queryRaw(
			Prisma.sql`UPDATE public.chat
			SET type=CAST(${details.type} AS INTEGER), password=${details.password}, chat_name=${details.chat_name}
			WHERE chatid=CAST(${details.chatid} AS INTEGER);`
		);
		return { msg:"ok"};
	}
	
	async changeUserStatus(details: ChatUserStatusDto) {
		if (details.bantime > 0)
			var newtime = (Date.now() / 1000) + details.bantime * 60;
		console.log("bantime", newtime);
		try {
			const result = await this.db.$queryRaw(
				Prisma.sql`UPDATE public.user_chat
				SET status=CAST(${details.status} AS INTEGER), bantime=to_timestamp(${newtime})
				WHERE chatid=CAST(${details.chatid} AS INTEGER) AND userid=${details.userid};`
			);
		} catch (error) {
			try {
				const result = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_chat
					userid, chatid, status, bantime
					VALUES (${details.userid}, CAST(${details.chatid} AS INTEGER), CAST(${details.status} AS INTEGER), to_timestamp(${newtime});`
				);
			} catch (error) {
				throw new ForbiddenException();
			}
		}
		return { msg:"ok"};
	}
}
