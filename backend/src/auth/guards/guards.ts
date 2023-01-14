import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth.service";

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		console.log("authguard");
		// console.log('------------context');
		// console.log (context);
		// console.log('------------context');
		const activate = await super.canActivate(context) as boolean;
		const request = context.switchToHttp().getRequest();
		// console.log('------------request');
		// console.log (request);
		// console.log('------------request');
		await super.logIn(request);
		return activate;
	}
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	constructor(public readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		console.log('--------------- authenticated guard');
		console.log(request);
		console.log(request.sessionStore.sessions);
		try {
			const user = await this.authService.findUser(request.session.passport.userid);
			if (request.session.passport.access_token == user.access_token) {
				console.log('authenticated');
				return request.isAuthenticated();
			} else {
				throw new ForbiddenException();
			}
		} catch (error) {
			// console.log('not authenticated');
			request.isUnauthenticated();
			throw new ForbiddenException();
		}
	}
}