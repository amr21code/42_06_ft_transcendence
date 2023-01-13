import apiInstance from "../http.common";

class LoggingService {
	getLog() : Promise<any> {
		return apiInstance.get("http://192.168.56.2:3000/users/all");
	}
}

export default new LoggingService();