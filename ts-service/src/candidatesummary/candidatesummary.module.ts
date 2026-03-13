import { Module } from '@nestjs/common';
import { CandidatesummaryService } from './candidatesummary.service';
import { CandidatesummaryController } from './candidatesummary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateSummary } from './entity/candidate-summary.entity';
import { Candidate } from '../candidate/entity/candidate.entity';
import { CandidateDocument } from 'src/candidatedocument/entity/candidate-document.entity';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateSummary, Candidate, CandidateDocument]),
    QueueModule
  ],
  controllers: [CandidatesummaryController],
  providers: [CandidatesummaryService],
})
export class CandidatesummaryModule {}
