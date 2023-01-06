import { Module } from '@nestjs/common';
import { FriendlistController } from './friendlist.controller';
import { FriendlistService } from './friendlist.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [FriendlistController],
  providers: [FriendlistService, UserService]
})
export class FriendlistModule {}
