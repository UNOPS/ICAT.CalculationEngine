import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAmsIiiC15Service } from './unfccc-ams-iii-c-15.service';

describe('UnfcccAmsIiiC15Service', () => {
  let service: UnfcccAmsIiiC15Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnfcccAmsIiiC15Service],
    }).compile();

    service = module.get<UnfcccAmsIiiC15Service>(UnfcccAmsIiiC15Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
