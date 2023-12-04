import { Test, TestingModule } from '@nestjs/testing';
import { CdmAcm0017Service } from './cdm-acm0017.service';

describe('CdmAcm0017Service', () => {
  let service: CdmAcm0017Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdmAcm0017Service],
    }).compile();

    service = module.get<CdmAcm0017Service>(CdmAcm0017Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
