import { Test, TestingModule } from '@nestjs/testing';
import { JsonFileViwerService } from './json-file-viwer.service';

describe('JsonFileViwerService', () => {
  let service: JsonFileViwerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonFileViwerService],
    }).compile();

    service = module.get<JsonFileViwerService>(JsonFileViwerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
