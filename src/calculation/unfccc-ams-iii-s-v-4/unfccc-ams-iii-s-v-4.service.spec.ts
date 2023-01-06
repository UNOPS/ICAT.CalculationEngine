import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAmsIIISV4Service } from './unfccc-ams-iii-s-v-4.service';

describe('CdmAmsIiiSService', () => {
  let service: UnfcccAmsIIISV4Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnfcccAmsIIISV4Service],
    }).compile();

    service = module.get<UnfcccAmsIIISV4Service>(UnfcccAmsIIISV4Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
