import { Test, TestingModule } from '@nestjs/testing';
import { IcatTpm2020Service } from './icat-tpm-2020.service';

describe('IcatTpm2020Service', () => {
  let service: IcatTpm2020Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IcatTpm2020Service],
    }).compile();

    service = module.get<IcatTpm2020Service>(IcatTpm2020Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
