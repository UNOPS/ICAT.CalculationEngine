import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionService } from './projection.service';

describe('ProjectionService', () => {
  let service: ProjectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectionService],
    }).compile();

    service = module.get<ProjectionService>(ProjectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
