import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionController } from './projection.controller';

describe('ProjectionController', () => {
  let controller: ProjectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectionController],
    }).compile();

    controller = module.get<ProjectionController>(ProjectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
