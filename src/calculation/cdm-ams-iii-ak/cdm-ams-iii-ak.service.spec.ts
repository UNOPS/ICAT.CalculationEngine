import { Test, TestingModule } from '@nestjs/testing';
import { CdmAmsIiiAkService } from './cdm-ams-iii-ak.service';

describe('CdmAmsIiiAkService', () => {
  let service: CdmAmsIiiAkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdmAmsIiiAkService],
    }).compile();

    service = module.get<CdmAmsIiiAkService>(CdmAmsIiiAkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
