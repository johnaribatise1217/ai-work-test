import { Test, TestingModule } from '@nestjs/testing';
import { CandidatedocumentController } from './candidatedocument.controller';
import { CandidatedocumentService } from './candidatedocument.service';

describe('CandidatedocumentController', () => {
  let controller: CandidatedocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatedocumentController],
      providers: [CandidatedocumentService],
    }).compile();

    controller = module.get<CandidatedocumentController>(CandidatedocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
