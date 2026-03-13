import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CandidateDocument } from "../candidatedocument/entity/candidate-document.entity";
import { CandidateSummary } from "../candidatesummary/entity/candidate-summary.entity";
import { SUMMARIZATION_PROVIDER } from "../llm/summarization-provider.interface";
import { Repository } from "typeorm";
import { GeminiSummarizationProvider } from "src/llm/GeminiSummarizationProvider";
import { QueueService } from "src/queue/queue.service";

@Injectable()
export class SummaryProcessor {
  constructor(
    @InjectRepository(CandidateSummary)
    private candidateSummaryRepo: Repository<CandidateSummary>,

    @InjectRepository(CandidateDocument)
    private candidateDocumentRepo: Repository<CandidateDocument>,

    @Inject(SUMMARIZATION_PROVIDER)
    private summaryProvider: GeminiSummarizationProvider,

    private readonly queue: QueueService,
  ) {}

  async process(summaryId: string, candidateId: string){
    const summary = await this.candidateSummaryRepo.findOne({
      where: {id: summaryId}
    })
    if(!summary) return 

    try {
      const documents = await this.candidateDocumentRepo.find({
        where : {candidateId}
      })
      const allRawTexts = documents.map(doc => doc.rawText)
      const generatedSummary = await this.summaryProvider.generateCandidateSummary({
        candidateId,
        documents: allRawTexts
      })

      summary.status = 'completed'
      summary.score = generatedSummary.score;
      summary.strengths = generatedSummary.strengths;
      summary.concerns = generatedSummary.concerns;
      summary.summary = generatedSummary.summary;
      summary.recommendedDecision = generatedSummary.recommendedDecision;

      await this.candidateSummaryRepo.save(summary)
    } catch (error) {

      summary.retryCount += 1;

      if (summary.retryCount < 3) { //retry 3 times if there's an error

        // retry again later
        summary.status = 'pending';

        await this.candidateSummaryRepo.save(summary);

        this.queue.enqueue('candidate-summary-generation', {
          summaryId,
          candidateId
        });

      } else {
        summary.status = 'failed';
        summary.errorMessage = String(error);

        await this.candidateSummaryRepo.save(summary);
      }
    }
  }
}