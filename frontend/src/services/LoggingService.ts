import apiInstance from "../http.common";

class LoggingService {
	getLog() : Promise<any> {
		return apiInstance.get("http://localhost:3000/users/all");
	}
}

export default new LoggingService();