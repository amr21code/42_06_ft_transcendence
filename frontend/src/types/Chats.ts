interface IChats {
	//{ "chatid": 40, "chat_name": "newname", "typename": "public", "status": 0 }
	chatid: number,
	chat_name: string,
	typename: string,
	status: number,
	statusname : string,
	password: string,
}

export type { IChats }