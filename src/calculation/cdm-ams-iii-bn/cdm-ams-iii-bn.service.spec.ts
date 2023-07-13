import { Test, TestingModule } from '@nestjs/testing';
import { CdmAmsIiiBnService } from './cdm-ams-iii-bn.service';

describe('CdmAmsIiiBnService', () => {
  let service: CdmAmsIiiBnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdmAmsIiiBnService],
    }).compile();

    service = module.get<CdmAmsIiiBnService>(CdmAmsIiiBnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
