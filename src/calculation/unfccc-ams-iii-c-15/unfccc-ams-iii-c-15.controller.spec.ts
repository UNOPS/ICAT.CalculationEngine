import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAmsIiiC15Controller } from './unfccc-ams-iii-c-15.controller';

describe('UnfcccAmsIiiC15Controller', () => {
  let controller: UnfcccAmsIiiC15Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnfcccAmsIiiC15Controller],
    }).compile();

    controller = module.get<UnfcccAmsIiiC15Controller>(UnfcccAmsIiiC15Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
