import { Controller, ForbiddenException, Get, Param,  Post,  Put,  Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthenticatedGuard} from '../auth/guards/guards';
import { Request } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
//@UseGuards(AuthenticatedGuard)
export class UserController {
	constructor(private readonly userService: UserService){}

	@Get('me')
	async getMe(@Req() request: Request) {
		try {
			const user = await this.userService.getMe(request.user);
			return user;
		} catch (error) {
			throw new ForbiddenException('getMe failed');
		}
	}

	@Get('all')
	async getAll() {
		try {
			const users = await this.userService.getAll();
			return users;
		} catch (error) {
			throw new ForbiddenException('getAll failed');
		}
	}

	@Get(':userid')
	async getOne(@Param('userid') userid) {
		try {
			const users = await this.userService.getOne(userid);
			return users;
		} catch (error) {
			throw new ForbiddenException('getOne failed');
		}
	}
	
	@Get(':userid/:field/:new')
	async changeUserData(@Req() request: Request, @Param('userid') userid, @Param('field') field, @Param('new') newdata) {
		const user = request.session.passport.user.userid;
		try {
				if (userid != user)
					throw new ForbiddenException();
				const status = await this.userService.changeUserData(userid, field, newdata);
					return { msg : "ok" };
			} catch (error) {
				throw new ForbiddenException('changeUserData failed');
			}
		}
		
		@Get(':userid/:field')
		async getUserData(@Req() request: Request, @Param('userid') userid, @Param('field') field) {
		const user = request.session.passport.user.userid;
		try {
				if (userid != user)
					throw new ForbiddenException();
				const status = await this.userService.getUserData(userid, field);
					return { msg : "ok" };
			} catch (error) {
				throw new ForbiddenException('getUserData failed');
			}
	}

	@Get('leaderboardpos/:userid')
	async getLeaderboardPos(@Param('userid') userid){
		try{
			await this.userService.getLeaderboardPos(userid);
		} catch (error) {
			throw new ForbiddenException('getLeaderboardPos failed');
		}
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: './upload',
			filename: (req, file, callback) => {
				const ext = extname(file.originalname);
				const filename = `${req.session.passport.user.userid}${ext}`;
				callback(null, filename);
			}
		})
	}))
	async upload(@UploadedFile() file: Express.Multer.File){
		console.log('file', file);
	}
}
