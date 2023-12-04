import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAm0016V5Service } from './unfccc-am0016-v-5.service';

describe('UnfcccAm0016V5Service', () => {
  let service: UnfcccAm0016V5Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnfcccAm0016V5Service],
    }).compile();

    service = module.get<UnfcccAm0016V5Service>(UnfcccAm0016V5Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
