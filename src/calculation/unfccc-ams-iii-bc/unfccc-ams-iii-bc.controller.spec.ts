import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAmsIiiBcController } from './unfccc-ams-iii-bc.controller';

describe('UnfcccAmsIiiBcController', () => {
  let controller: UnfcccAmsIiiBcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnfcccAmsIiiBcController],
    }).compile();

    controller = module.get<UnfcccAmsIiiBcController>(UnfcccAmsIiiBcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
