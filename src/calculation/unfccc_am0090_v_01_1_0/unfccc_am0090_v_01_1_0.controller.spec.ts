import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAm0090V0110Controller } from './unfccc_am0090_v_01_1_0.controller';

describe('Icatm1Controller', () => {
  let controller: UnfcccAm0090V0110Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnfcccAm0090V0110Controller],
    }).compile();

    controller = module.get<UnfcccAm0090V0110Controller>(UnfcccAm0090V0110Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
