import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/guards';

@Controller('match')
@UseGuards(AuthenticatedGuard)
export class MatchController {
	constructor() {}

	@Get('list')
	async listMatches() {
		return this.listMatches();
	}

	@Get('open')
	async openMatch() {
		
	}

}
