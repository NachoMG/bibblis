import { Test, TestingModule } from '@nestjs/testing';
import { OpenLibraryService } from './open-library.service';

describe('OpenLibraryService', () => {
  let service: OpenLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenLibraryService],
    }).compile();

    service = module.get<OpenLibraryService>(OpenLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
