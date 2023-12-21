import { Module } from '@nestjs/common';
import { BendeController } from './bende.controller';
import { BendeService } from './bende.service';

@Module({
  controllers: [BendeController],
  providers: [BendeService]
})
export class BendeModule {}