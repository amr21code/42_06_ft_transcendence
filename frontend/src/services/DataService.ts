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
}

export default new DataService();