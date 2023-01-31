import apiInstance from "../http.common";

class DataService {

	//################ GENERAL ###########################################
	
	getAuthStatus() : Promise<any> {
		return apiInstance.get("/auth/status");
	}
	getUser() : Promise<any> {
		return apiInstance.get("/users/me");
	}
	getAll() : Promise<any> {
		return apiInstance.get("/users/all");
	}
	getFriends() : Promise<any> {
		return apiInstance.get("/fl/show");
	}
	changeUsername(userid : string, newUsername : string) {
		return apiInstance.get('/users/' + userid + '/username/' + newUsername);
	}
	changeAvatar(userid : string, id : number) {
		return apiInstance.get('/users/' + userid + '/avatar/' + id);
	}

	//################ CHAT ###########################################

	getUsersInChat(chatid: number) : Promise<any> {
		return apiInstance.get("/chat/list/users/" + chatid);
	}
	
	getJoinedChats() : Promise<any> {
		return apiInstance.get("/chat/list/userchats");
	}
	getOpenChats() : Promise<any> {
		return apiInstance.get("/chat/list/chats");
	}
	createChat(chatname_id: string, password: string, type : String) : Promise<any> {
		console.log(chatname_id, password, type);
		if (type == 'dm')
		return apiInstance.get('/chat/open/pm/' + chatname_id)
		if (type == 'join') //change that you pass the chatid and optional password in order to join an existing chat
		{
			if (password === '')
				return apiInstance.get('/chat/join/' + chatname_id);
			else
				return apiInstance.get('/chat/join/' + chatname_id + '/' + password);	
		}
		else {
			// { type: number; chatid: number; chat_name: string; password: string; }
			if (type === 'private')
				var n_type = 2;
			else if (type === 'protected')
				var n_type = 1;
			else
				var n_type = 0;
			return apiInstance.post('/chat/create', JSON.stringify({
				type : n_type,
				chatid: 0,
				chat_name: chatname_id,
				password: password
			}));
		}
	}
	async getMessages(chatid : number) : Promise<any> {
		return apiInstance.get('/chat/list/messages/' + chatid);
	}
	leaveChat(chatid : number) : Promise<any> {
		return apiInstance.get('/chat/leave/' + chatid)
	}
	muteUser(chatid : number, userid : string, time : number) : Promise<any> {
		console.log("muteUser", chatid, userid, time);
		// return apiInstance.get('/chat/mute/' + chatid + '/' + userid + '/' + time);
		return "OK";
	}

	banUser(chatid : number, userid : string, time : number) : Promise<any> {
		console.log("banUser", chatid, userid, time);
		// return apiInstance.get('/chat/mute/' + chatid + '/' + userid + '/' + time);
		return "OK";
	}

	changeChatName (type : String, chatid : number, chat_name : String, password : String) {
		var n_type;
		if (type == "public")
			n_type = 0;
		else if (type == "protected")
			n_type = 1;
		else if (type == "private")
			n_type = 2;
		else if (type == "direct")
			n_type = 3;
		if (password == undefined)
			password = '';
		return apiInstance.post('/chat/details', JSON.stringify({
			type : n_type,
			chatid: chatid,
			chat_name: chat_name,
			password: password
		}), 
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'}
		})
	}
	
	//################ MATCH ###########################################
	
	getMatchHistory(userid : string) : Promise<any> {
		return apiInstance.get('/match/history/' + userid);
	}
	gameOver(gameState : any, playerNumber: number) : Promise<any> {
		return apiInstance.post('/match/gameover/' + playerNumber, JSON.stringify(gameState));
	}
	openSingleMatch(): Promise<any> {
		return apiInstance.get('/match/opensingle');
	}
	async joinMatchQueue(): Promise<any> {
		return await apiInstance.get('/match/making'); 
	}
	challengeUser(userid: string) : Promise<any> {
		return apiInstance.get('/match/open/' + userid);
	}
	acceptChallenge() : Promise<any> {
		return apiInstance.get('/match/accept');
	}
	denyChallenge() : Promise<any> {
		return apiInstance.get('/match/delete');
	}
}

export default new DataService();