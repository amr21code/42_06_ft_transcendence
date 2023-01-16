import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth.service";

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// console.log("authguard");

		const activate = await super.canActivate(context) as boolean;
		const request = context.switchToHttp().getRequest();
		// console.log(request.sessionStore.sessions);
		// console.log(request.sessionID);

		await super.logIn(request);
		return activate;
	}
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	constructor(public readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		// console.log('--------------- authenticated guard');
		// console.log(request);
		// console.log(JSON.parse(request.sessionStore.sessions[request.sessionID]).passport.user.userid);
		// console.log(request.sessionID);
		try {
			const session = JSON.parse(request.sessionStore.sessions[request.sessionID]).passport.user;
			
			
			
			// DB Query not necessary - Access Token also not necessary
			const user = await this.authService.findUser(session.userid);




			// console.log('user', user);
			// console.log('accesstoken', session.access_token);
			if (session.access_token == user.access_token) {
				// console.log('authenticated');
				return request.isAuthenticated();
			} else {
				// console.log("access token wrong");
				throw new ForbiddenException();
			}
		} catch (error) {
			// console.log('not authenticated');
			request.isUnauthenticated();
			throw new ForbiddenException();
		}
	}
}