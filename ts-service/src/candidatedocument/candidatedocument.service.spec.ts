import { Test, TestingModule } from '@nestjs/testing';
import { CandidatedocumentService } from './candidatedocument.service';

describe('CandidatedocumentService', () => {
  let service: CandidatedocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatedocumentService],
    }).compile();

    service = module.get<CandidatedocumentService>(CandidatedocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
