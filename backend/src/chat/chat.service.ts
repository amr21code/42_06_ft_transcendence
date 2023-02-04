import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from '../db/db.service';
import { ChatMessageDto } from './dto';
import { ChatDto } from './dto/chat.dto';
import { ChatUserStatusDto } from './dto/chatuserstatus.dto';
import * as bcrypt from 'bcrypt';

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

	async listChats(userid: string) {
		const list = await this.db.$queryRaw(
			Prisma.sql`SELECT c.chatid, chat_name, ct.typename, uc.status, uc.userid
			FROM public.chat AS c
			LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
			LEFT JOIN public.user_chat as uc ON uc.chatid=c.chatid
			WHERE c.type<2 AND c.chatid NOT IN (SELECT chatid FROM public.user_chat WHERE userid=${userid})`
		);
		return list;
	}

	async listUserChats(userid: string) {
		const list = await this.db.$queryRaw(
			Prisma.sql`SELECT uc.userid, usc.statusname, c.chatid, c.chat_name, ct.typename
			FROM public.user_chat AS uc
			LEFT JOIN public.user_status_chat as usc ON uc.status=usc.statusid
			LEFT JOIN public.chat as c ON uc.chatid=c.chatid
			LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
			WHERE uc.userid=${userid} AND (uc.status < 3 OR uc.bantime < CURRENT_TIMESTAMP)
			ORDER BY chatid ASC`
		);
		return list;
	}

	async listUsers(chatid: number) {
		var list;
		if (chatid) {
			list = await this.db.$queryRaw(
				Prisma.sql`SELECT uc.userid, u.username, u.user_status uc.status, uc.bantime, usc.statusname, c.chatid, c.chat_name, ct.typename
				FROM public.user_chat AS uc
				LEFT JOIN public.user_status_chat as usc ON uc.status=usc.statusid
				LEFT JOIN public.chat as c ON uc.chatid=c.chatid
				LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
				LEFT JOIN public.users as u ON u.userid=uc.userid
				WHERE uc.chatid=CAST(${chatid} AS INTEGER)
				ORDER BY userid ASC`
			);
		// } else {
			// list = await this.db.$queryRaw(
			// 	Prisma.sql`SELECT uc.userid, u.username, usc.statusname, c.chatid, c.chat_name, ct.typename, password
			// 	FROM public.user_chat AS uc
			// 	LEFT JOIN public.user_status_chat as usc ON uc.status=usc.statusid
			// 	LEFT JOIN public.chat as c ON uc.chatid=c.chatid
			// 	LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
			// 	LEFT JOIN public.users as u ON u.userid=uc.userid
			// 	WHERE c.type<2
			// 	ORDER BY userid ASC`
			// );
		}
		return list;
	}

	async joinChat(userid: string, chatid?: number, pw?: string) {
		if (pw) {
			var pwHash = await bcrypt.hash(pw, 10);
		}
		const result = await this.db.$queryRaw(
			Prisma.sql`SELECT chatid, password FROM public.chat
			WHERE chatid=CAST(${chatid} AS INTEGER)`
		);
		const banned = await this.db.$queryRaw(
			Prisma.sql`SELECT * FROM public.user_chat
			WHERE userid=${userid} AND chatid=CAST(${chatid} AS INTEGER)`
		);
		if (Object.keys(banned).length == 1) {
			if (banned[0].bantime < (Date.now() / 1000)) {
				this.leaveChat(userid, chatid);
			} else {
				throw new ForbiddenException();
			}
		}
		try {
			var pwmatch = true;
			if (result[0].passport)
				pwmatch = await bcrypt.compare(pw, result[0].password);
			console.log("res", result[0].password);
			console.log("hash", pwHash);
			console.log("match", pwmatch);
			if (result[0].chatid == chatid && pwmatch) {
				console.log("true");
				const join = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_chat(
						userid, chatid, status)
						VALUES (${userid}, CAST(${chatid} AS INTEGER), 1);`
						);
				return ({msg: 'ok'});
			} else {
				throw new ForbiddenException();
			}
		} catch (error) {
			try {
				var chatname = 'public chat by ' + userid;
				const create = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.chat(type, chat_name, password)
					VALUES (0, ${chatname}, ${pwHash})
					RETURNING chatid;`
				);
				const join = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_chat(
						userid, chatid, status) 
						VALUES (${userid}, CAST(${create[0].chatid} AS INTEGER), 0);`
				);
				return (create[0].chatid);
			} catch (error) {
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
			WHERE userid=${message.userid} AND chatid=${message.chatid} AND (status < 2 OR bantime < CURRENT_TIMESTAMP)`
		);
		console.log(user);
		if (user[0].status >= 2) {
			const userDto = await this.createPMUserDto(message.userid, message.chatid);
			userDto.bantime = 0;
			userDto.status = 1;
			await this.changeUserStatus(userDto);
		}
		if (Object.keys(user).length == 0)
			return false;
		const msg = await this.db.$queryRaw(
			Prisma.sql`INSERT INTO public.chat_messages(
				userid, chatid, message)
				VALUES (${message.userid}, CAST(${message.chatid} AS INTEGER), ${message.message});`
		);
		return true;
	}

	async listMessages(userid: string, chatid: string) {
		const list = await this.db.$queryRaw(
			Prisma.sql`SELECT u.userid, u.username, cm.chatid, cm.message, cm.time, fl.statuscode
			FROM public.chat_messages AS cm
			LEFT JOIN public.users as u ON u.userid=cm.userid
			LEFT JOIN public.friends as fl ON cm.userid=fl.addresseeid AND fl.requesterid=${userid}
			WHERE chatid=CAST(${chatid} AS INTEGER) AND fl.statuscode IS DISTINCT FROM '2'
			ORDER BY cm.time ASC`
		);
		return list;
	}

	async changeChatDetails(details: ChatDto) {
		if (details.password) {
			const salt = 10;
			var pwHash = await bcrypt.hash(details.password, salt);
		}
		const result = await this.db.$queryRaw(
			Prisma.sql`UPDATE public.chat
			SET type=CAST(${details.type} AS INTEGER), password=${pwHash}, chat_name=${details.chat_name}
			WHERE chatid=CAST(${details.chatid} AS INTEGER);`
		);
		return { msg:"ok"};
	}
	
	async changeUserStatus(details: ChatUserStatusDto) {
		if (details.bantime > 0)
			var newtime = (Date.now() / 1000) + details.bantime * 60;
		try {
			const result = await this.db.$executeRaw(
				Prisma.sql`UPDATE public.user_chat
				SET status=CAST(${details.status} AS INTEGER), bantime=to_timestamp(${newtime})
				WHERE chatid=CAST(${details.chatid} AS INTEGER) AND userid=${details.userid};`
			);
			if (result == 0) {
				const result_insert = await this.db.$queryRaw(
					Prisma.sql`INSERT INTO public.user_chat
					(userid, chatid, status)
					VALUES (${details.userid}, CAST(${details.chatid} AS INTEGER), CAST(${details.status} AS INTEGER));`
					);
			}
		} catch (error) {
			throw new ForbiddenException();
		}
		return { msg:"ok"};
	}

	async createPMChatDto(user1id: string, user2id: string, chatid: number) {
		var chatdetails = JSON.stringify({
			chat_name: "private " + user1id + "/" + user2id,
			chatid: chatid,
			type: 3,
		});
		var ret = JSON.parse(chatdetails) as ChatDto;
		return ret;
	}

	async createPMUserDto(userid: string, chatid: number) {
		var details = JSON.stringify({
			userid: userid,
			status: 1,
			bantime: 0,
			chatid: chatid,
		});
		var ret = JSON.parse(details) as ChatUserStatusDto;
		return ret;
	}

	async checkPMChat(user1id: string, user2id: string) {
		const check = await this.db.$queryRaw(
			Prisma.sql`SELECT c.chatid, COUNT(*)
				FROM public.chat AS c
				LEFT JOIN public.chat_type as ct ON ct.typeid=c.type
				LEFT JOIN public.user_chat as uc ON uc.chatid=c.chatid
				WHERE c.type=3 AND (uc.userid=${user1id} OR uc.userid=${user2id})
				GROUP BY c.chatid
				HAVING COUNT(*)>1;`
		);
		if (Object.keys(check).length == 1) {
			throw new ForbiddenException('direct chat already open');
		}

	}
}
