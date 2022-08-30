import { Test, TestingModule } from '@nestjs/testing';
import { FuseService } from './fuse.service';

describe('FuseService', () => {
  let service: FuseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuseService],
    }).compile();

    service = module.get<FuseService>(FuseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
