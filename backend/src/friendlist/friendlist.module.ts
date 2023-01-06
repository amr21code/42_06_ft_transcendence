import { Module } from '@nestjs/common';
import { FriendlistController } from './friendlist.controller';
import { FriendlistService } from './friendlist.service';

@Module({
  controllers: [FriendlistController],
  providers: [FriendlistService]
})
export class FriendlistModule {}
