// interface User {
// 	id: string,
// 	alias: string,
// 	created: string,
// }

// export type { User }

interface IUser {
	userid: string,
	username: string,
	picurl: string,
	profilepic42: string,
	created: Date,
	statusname: string,
	wins: string,
	losses: string,
	status: number, //0: admin, 1: member, 2: mute, 3: ban
	bantime: Date,
	// title: string,
	// completed: boolean
}

export type { IUser }