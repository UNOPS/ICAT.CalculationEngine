import { Test, TestingModule } from '@nestjs/testing';
import { UnfcccAm0016V5Controller } from './unfccc-am0016-v-5.controller';

describe('UnfcccAm0016V5Controller', () => {
  let controller: UnfcccAm0016V5Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnfcccAm0016V5Controller],
    }).compile();

    controller = module.get<UnfcccAm0016V5Controller>(UnfcccAm0016V5Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
