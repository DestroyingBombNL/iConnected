import { Module } from '@nestjs/common';
import { BendeController } from './bende.controller';
import { BendeService } from './bende.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule],
  controllers: [BendeController],
  providers: [BendeService, JwtService]
})
export class BendeModule {}