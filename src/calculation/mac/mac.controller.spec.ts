import { Test, TestingModule } from '@nestjs/testing';
import { MacController } from './mac.controller';

describe('MacController', () => {
  let controller: MacController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MacController],
    }).compile();

    controller = module.get<MacController>(MacController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
