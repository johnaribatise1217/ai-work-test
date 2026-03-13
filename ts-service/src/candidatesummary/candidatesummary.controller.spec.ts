import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesummaryController } from './candidatesummary.controller';
import { CandidatesummaryService } from './candidatesummary.service';

describe('CandidatesummaryController', () => {
  let controller: CandidatesummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesummaryController],
      providers: [CandidatesummaryService],
    }).compile();

    controller = module.get<CandidatesummaryController>(CandidatesummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
