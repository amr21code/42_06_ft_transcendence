import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth.service";

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
	constructor(public readonly authService: AuthService) {super()}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const activate = await super.canActivate(context) as boolean;
		const request = context.switchToHttp().getRequest();
		await super.logIn(request);
		return activate;
	}
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	constructor(public readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		try {
			const session = JSON.parse(request.sessionStore.sessions[request.sessionID]).passport.user;
			const user = await this.authService.findUser(session.userid);
			if (session.access_token == user.access_token) {
				if (session.twofa == 1) {
					if (session.twofalogin == 1) {
						return request.isAuthenticated()
					} else {
						throw new ForbiddenException();		
					}
				}
				return request.isAuthenticated()
			} else {
				throw new ForbiddenException();
			}
		} catch (error) {
			throw new ForbiddenException();
		}
	}
}