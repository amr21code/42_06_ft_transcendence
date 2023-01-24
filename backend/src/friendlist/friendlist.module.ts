import { Module } from '@nestjs/common';
import { FriendlistController } from './friendlist.controller';
import { FriendlistService } from './friendlist.service';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AchievementsService } from 'src/achievements/achievements.service';

@Module({
  controllers: [FriendlistController],
  providers: [FriendlistService, UserService, AuthService, AchievementsService]
})
export class FriendlistModule {}
