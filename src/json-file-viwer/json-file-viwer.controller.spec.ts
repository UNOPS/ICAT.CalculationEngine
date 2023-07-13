import { Test, TestingModule } from '@nestjs/testing';
import { JsonFileViwerController } from './json-file-viwer.controller';

describe('JsonFileViwerController', () => {
  let controller: JsonFileViwerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonFileViwerController],
    }).compile();

    controller = module.get<JsonFileViwerController>(JsonFileViwerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
