import { Test, TestingModule } from '@nestjs/testing';
import { CdmAmsIiiAkController } from './cdm-ams-iii-ak.controller';
import { CdmAmsIiiAkService } from './cdm-ams-iii-ak.service';

describe('CdmAmsIiiAkController', () => {
  let controller: CdmAmsIiiAkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CdmAmsIiiAkController],
      providers: [CdmAmsIiiAkService],
    }).compile();

    controller = module.get<CdmAmsIiiAkController>(CdmAmsIiiAkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
