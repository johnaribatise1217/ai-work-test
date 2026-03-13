import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesummaryService } from './candidatesummary.service';

describe('CandidatesummaryService', () => {
  let service: CandidatesummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatesummaryService],
    }).compile();

    service = module.get<CandidatesummaryService>(CandidatesummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
