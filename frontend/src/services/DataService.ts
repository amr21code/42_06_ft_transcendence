import apiInstance from "../http.common";

class DataService {
	getUser() : Promise<any> {
		return apiInstance.get("/users/me");
	}
	getAll() : Promise<any> {
		return apiInstance.get("/users/all");
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

	changeChatName (type : number, chatid : number, chat_name : String, password : String) {
		//{ type: number; chatid: number; chat_name: string; password: string; }
		if (password == undefined)
			password = '';
		return apiInstance.post('/chat/details', JSON.stringify({
			type : type,
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