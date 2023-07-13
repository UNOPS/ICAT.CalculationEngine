import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerPriceService } from './consumer-price.service.service';

describe('ConsumerPrice.ServiceService', () => {
  let service: ConsumerPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumerPriceService],
    }).compile();

    service = module.get<ConsumerPriceService>(ConsumerPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
