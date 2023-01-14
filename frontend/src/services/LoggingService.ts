import apiInstance from "../http.common";

class LoggingService {
	getLog() : Promise<any> {
		return apiInstance.get("/users/all");
	}
}

export default new LoggingService();