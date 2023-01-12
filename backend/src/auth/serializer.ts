import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(
		@Inject('AUTH_SERVICE') private readonly authService: AuthService,
	) {
		super();
	}

	serializeUser(user: any, done: Function) { //change any to User class/Object
		// console.log('Serialize ', user.userid);
		console.log(done(null, user));
		done(null, user);
	}

	async deserializeUser(payload: any, done: Function) {
		const user = await this.authService.findUser(payload.userid);
		// console.log("Deserialize ", done(null, user));
		return user ? done(null, user) : done (null, null);
	}
}