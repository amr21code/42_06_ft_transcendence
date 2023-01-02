import apiInstance from "../http.common";

class DataService {
	getUser(id: any) : Promise<any> {
		return apiInstance.get("https://jsonplaceholder.typicode.com/" + id);
	}
	getAll() : Promise<any> {
		return apiInstance.get("https://jsonplaceholder.typicode.com/todos")
	}
}

export default new DataService();