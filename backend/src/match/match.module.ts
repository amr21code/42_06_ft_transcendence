import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { MatchGateway } from './match.gateway';
import { AchievementsService } from 'src/achievements/achievements.service';
import { TwoFactorAuthenticationService } from 'src/auth/twoFactorAuth.service';


@Module({
  controllers: [MatchController],
  providers: [MatchService, AuthService, UserService, MatchGateway, AchievementsService, TwoFactorAuthenticationService]
})
export class MatchModule {}
