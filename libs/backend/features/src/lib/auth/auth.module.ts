import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, UserService, JwtService]
})
export class AuthModule {}