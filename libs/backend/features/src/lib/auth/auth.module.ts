import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Module({
  exports: [AuthService],
  providers: [AuthService, UserService]
})
export class AuthModule {}