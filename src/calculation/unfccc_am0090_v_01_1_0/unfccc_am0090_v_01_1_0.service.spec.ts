import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAm0090V0110Service } from './unfccc_am0090_v_01_1_0.service';

describe('Icatm1Service', () => {
  let service: UnfcccAm0090V0110Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnfcccAm0090V0110Service],
    }).compile();

    service = module.get<UnfcccAm0090V0110Service>(UnfcccAm0090V0110Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
