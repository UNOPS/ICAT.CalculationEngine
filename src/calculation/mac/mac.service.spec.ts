import { Test, TestingModule } from '@nestjs/testing';
import { MacService } from './mac.service';

describe('MacService', () => {
  let service: MacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MacService],
    }).compile();

    service = module.get<MacService>(MacService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
