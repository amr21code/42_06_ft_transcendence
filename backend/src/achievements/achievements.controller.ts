import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/guards';
import { AchievementsService } from './achievements.service';

@Controller('achieve')
// @UseGuards(AuthenticatedGuard)
export class AchievementsController {
	constructor(private readonly achieveService: AchievementsService) {}

	@Get('show/:userid')
	async showAchieve(@Param('userid') userid) {
		const achievements = await this.achieveService.showAchieve(userid);
		return achievements;
	}

	@Get('add/:userid/:achid')
	async addAchieve(@Param('userid') userid, @Param('achid') achid) {
		const achievements = await this.achieveService.addAchieve(userid, achid);
		return achid;
	}
}
