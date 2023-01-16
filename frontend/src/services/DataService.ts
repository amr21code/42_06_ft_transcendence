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

	async sendMessage (userid : string, chatid : number, message : string) {
		console.log("sendMessage function for triggert with", userid, chatid, message);
		await fetch('http://localhost:3000/chat/message', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				userid: userid, 
				chatid: chatid,
				message: message

			})
		})

	}
}

export default new DataService();