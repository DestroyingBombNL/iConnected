import { Test, TestingModule } from '@nestjs/testing';
import { FilterController } from './filter.controller';
import { beforeEach } from 'node:test';

describe('FilterController', () => {
  let controller: FilterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilterController],
    }).compile();

    controller = module.get<FilterController>(FilterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
