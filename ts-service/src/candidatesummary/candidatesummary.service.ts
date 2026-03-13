import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateSummary } from './entity/candidate-summary.entity';
import { Repository } from 'typeorm';
import { Candidate } from '../candidate/entity/candidate.entity';
import { CandidateDocument } from '../candidatedocument/entity/candidate-document.entity';
import { QueueService } from '../queue/queue.service';
import { randomUUID } from 'crypto';
import { AuthUser } from 'src/auth/auth.types';

@Injectable()
export class CandidatesummaryService {
  constructor(
    @InjectRepository(CandidateSummary)
    private readonly candidateSummaryRepository: Repository<CandidateSummary>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(CandidateDocument)
    private docRepo: Repository<CandidateDocument>,

    private queue: QueueService,
  ){}

  async requestSummaryGeneration(user: AuthUser, candidateId: string) {
    const candidate = await this.getCandidateById(user.workspaceId,candidateId)
    const summary = this.candidateSummaryRepository.create({
      id: randomUUID(),
      candidateId: candidate?.id,
      status: 'pending',
      provider: 'gemini',
      promptVersion: '2.5-flash', //you can enter your own model prompt version
    })

    await this.candidateSummaryRepository.save(summary)

    this.queue.enqueue('candidate-summary-generation', {
      summaryId: summary.id,
      candidateId
    })

    return {status: 'accepted', summaryId: summary.id}
  }

  async listSummaries(user: AuthUser, candidateId: string){
    await this.getCandidateById(user.workspaceId, candidateId)//access control
    return this.candidateSummaryRepository.find({
      where: { candidateId },
      order: { createdAt: 'DESC' },
    })
  }

  private async getCandidateById(workspaceId: string, candidateId: string) : Promise<Candidate | null>{
    const candidate = await this.candidateRepository.findOne({
      where: {id: candidateId, workspaceId} //workspaceId makes sure a recruiter can only access candidate resources they are authorized to
    })

    if(!candidate){
      throw new NotFoundException("Candidate Not Found")
    }

    return candidate;
  }

  async getSummary(user:AuthUser, candidateId: string, summaryId: string) {
    await this.getCandidateById(user.workspaceId, candidateId) //access control
    const summary = await this.candidateSummaryRepository.findOne({
      where: { id: summaryId, candidateId },
    });

    if (!summary) throw new NotFoundException('Summary not found');

    return summary;
  }
}
