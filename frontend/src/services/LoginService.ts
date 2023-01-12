import apiInstance from "../http.common";

class LoginService {
	login() : Promise<any> {
		const test = apiInstance.get("http://localhost:3000");
		return test;
		// return apiInstance.get("https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Freturn&client_id=u-s4t2ud-8affeef3d6eb0d25d3d614179575e429a1b7c886e7d3848ac0750b211d36a9cc");
	}
}

export default new LoginService();