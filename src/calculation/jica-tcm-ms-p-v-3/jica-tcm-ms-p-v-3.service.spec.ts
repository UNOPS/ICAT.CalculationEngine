import { Test, TestingModule } from '@nestjs/testing';
import { JicaTcmMsPV3Service } from './jica-tcm-ms-p-v-3.service';

describe('CalculationService', () => {
  let service: JicaTcmMsPV3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JicaTcmMsPV3Service],
    }).compile();

    service = module.get<JicaTcmMsPV3Service>(JicaTcmMsPV3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
