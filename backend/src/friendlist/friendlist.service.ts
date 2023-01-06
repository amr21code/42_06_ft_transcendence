// import { Injectable } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
// import { DbService } from 'src/db/db.service';

// @Injectable()
// export class FriendlistService {
// 	constructor (private db: DbService) {}

// 	async showFL(userid: string) {
// 		// const user = await this.db.$queryRaw(
// 		// 	Prisma.sql`select userid, username, CASE WHEN (select avatarurl from public.avatars where avatarid = avatar) IS NULL THEN profilepic42 ELSE (select avatarurl from public.avatars where avatarid = avatar) END as picurl,created, statusname from public.users
// 		// 	LEFT JOIN public.online_status ON users.user_status = online_status.statuscode
// 		// 	LEFT JOIN public.avatars as A ON users.avatar = A.avatarid`
// 		// 	);
// 		const user = await this.db.friends.findMany({
// 			where: {
// 				OR: [
// 					{
// 						requesterid: userid,
// 					},
// 					{
// 						addresseeid: userid,
// 					}
// 				]
// 			}
// 		})
// 		console.log('after db ', user);
// 		return (user);
// 	}
// }
