interface IMessages {
    //"username": "Jorit", "chatid": 42, "message": "awd", "time": "2023-01-21T10:23:48.604Z", "statuscode": null
	username: string,
    chatid: number,
	message: string,
	time: Date,
    statuscode: string
}

export type { IMessages }