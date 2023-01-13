import { Controller, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/guards';

@Controller('match')
@UseGuards(AuthenticatedGuard)
export class MatchController {
	constructor() {}

	// @Get('list')
	// async listMatches() {

	// }

}
