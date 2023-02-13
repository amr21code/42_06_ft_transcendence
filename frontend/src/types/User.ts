interface IUser {
	userid: string,
	username: string,
	picurl: string,
	profilepic42: string,
	created: Date,
	statusname: string,
	wins: number,
	losses: number,
	status: number, //0: admin, 1: member, 2: mute, 3: ban
	bantime: Date,
	paddlecolor: string,
	user_status : number,
	twofa: number,
}

export type { IUser }