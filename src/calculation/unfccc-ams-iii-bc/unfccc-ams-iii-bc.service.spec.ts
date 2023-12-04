import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAmsIiiBcService } from './unfccc-ams-iii-bc.service';

describe('UnfcccAmsIiiBcService', () => {
  let service: UnfcccAmsIiiBcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnfcccAmsIiiBcService],
    }).compile();

    service = module.get<UnfcccAmsIiiBcService>(UnfcccAmsIiiBcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
