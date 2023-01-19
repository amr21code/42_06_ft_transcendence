import apiInstance from "../http.common";

class DataService {
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
	getChats() : Promise<any> {
		return apiInstance.get("/chat/list/chats");
	}
	getDms() : Promise<any> {
		return apiInstance.get("/chat/list/chats");
	}
	createChat() : Promise<any> {
		return apiInstance.get('/chat/join');
	}
	async getMessages(chatid : number) : Promise<any> {
		return apiInstance.get('/chat/list/messages/' + chatid);
	}
	leaveChat(chatid : number) : Promise<any> {
		return apiInstance.get('/chat/leave/' + chatid)
	}

	sendMessage (userid : string, chatid : number, message : string) {
		// console.log("sendMessage function got triggered with", userid, chatid, message);
		return apiInstance.post('/chat/message', JSON.stringify({
			userid: userid,
			chatid: chatid,
			message: message
		}), 
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'}
		})
	}

	changeChatName (type : String, chatid : number, chat_name : String, password : String) {
		// console.log(type, chatid, chat_name, password);
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
}

export default new DataService();