import { Test, TestingModule } from '@nestjs/testing';
import { JicaTcmMsPV3Controller } from './jica-tcm-ms-p-v-3.controller';

describe('CalculationController', () => {
  let controller: JicaTcmMsPV3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JicaTcmMsPV3Controller],
    }).compile();

    controller = module.get<JicaTcmMsPV3Controller>(JicaTcmMsPV3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
