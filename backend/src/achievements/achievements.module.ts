import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [AchievementsController],
  providers: [AchievementsService, AuthService, UserService]
})
export class AchievementsModule {}
