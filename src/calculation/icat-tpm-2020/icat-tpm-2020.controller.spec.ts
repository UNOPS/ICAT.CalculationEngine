import { Test, TestingModule } from '@nestjs/testing';
import { IcatTpm2020Controller } from './icat-tpm-2020.controller';

describe('IcatTpm2020Controller', () => {
  let controller: IcatTpm2020Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IcatTpm2020Controller],
    }).compile();

    controller = module.get<IcatTpm2020Controller>(IcatTpm2020Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
