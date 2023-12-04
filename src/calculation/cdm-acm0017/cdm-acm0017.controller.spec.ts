import { Test, TestingModule } from '@nestjs/testing';
import { CdmAcm0017Controller } from './cdm-acm0017.controller';
import { CdmAcm0017Service } from './cdm-acm0017.service';

describe('CdmAmsIiiAkController', () => {
  let controller: CdmAcm0017Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CdmAcm0017Controller],
      providers: [CdmAcm0017Service],
    }).compile();

    controller = module.get<CdmAcm0017Controller>(CdmAcm0017Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
