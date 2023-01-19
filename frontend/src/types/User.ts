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
	created: Date,
	statusname: string,
	wins: string,
	losses: string,
	// title: string,
	// completed: boolean
}

export type { IUser }