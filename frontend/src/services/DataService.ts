import apiInstance from "../http.common";

class DataService {
	getUser() : Promise<any> {
		return apiInstance.get("http://localhost:3000/users/me" );
	}
	getAll() : Promise<any> {
		return apiInstance.get("http://localhost:3000/users/me")
	}
}

export default new DataService();