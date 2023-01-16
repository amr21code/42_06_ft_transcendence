import apiInstance from "../http.common";

class DataService {
	getUser() : Promise<any> {
		return apiInstance.get("/users/me" );
	}
	getAll() : Promise<any> {
		return apiInstance.get("/users/all");
	}
	getChats() : Promise<any> {
		return apiInstance.get("/chat/list/chats");
	}
	createChat() : Promise<any> {
		return apiInstance.get('/chat/join');
	}
	getMessages(chatid : string) : Promise<any> {
		return apiInstance.get('/chat/list/messages/' + chatid);
	}
	// sendMessage(chatid : string, msg : string) : Promise<any> {
	// 	return apiInstance.get('/chat/message/') // + JSON object with the message
	// }

	sendMessage (userid : string, chatid : number, message : string) {
		console.log("sendMessage function got triggered with", userid, chatid, message);
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
}

export default new DataService();