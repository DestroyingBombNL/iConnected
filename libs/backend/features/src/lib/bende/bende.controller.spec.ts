import { Test, TestingModule } from '@nestjs/testing';
import { BendeController } from './bende.controller';
import { beforeEach } from 'node:test';

describe('BendeController', () => {
  let controller: BendeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BendeController],
    }).compile();

    controller = module.get<BendeController>(BendeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
