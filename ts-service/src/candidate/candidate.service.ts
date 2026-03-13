import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entity/workspace.entity';
import { Candidate } from './entity/candidate.entity';
import { AuthUser } from 'src/auth/auth.types';
import { CreateCandidateDto } from './dto/CreateCandidateDto';
import { randomUUID } from 'crypto';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>
  ){}

  async createCandidate(user: AuthUser, dto: CreateCandidateDto): Promise<Candidate> {
    await this.ensureWorkspace(user.workspaceId)
    
    const candidate = this.candidateRepository.create({
      id: randomUUID(),
      workspaceId: user.workspaceId,
      recruiterId: user.userId,
      fullName: dto.fullName.trim(),
      email: dto.email.trim(),
      phoneNumber: dto.phoneNumber.trim()
    })

    return this.candidateRepository.save(candidate);
  }

  async listCandidates(user:AuthUser): Promise<Candidate[]>{
    return this.candidateRepository.find({
      where: { workspaceId: user.workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  private async ensureWorkspace(workspaceId: string): Promise<void> {
    const existing = await this.workspaceRepository.findOne({ where: { id: workspaceId } });

    if (existing) {
      return;
    }

    const workspace = this.workspaceRepository.create({
      id: workspaceId,
      name: `Workspace ${workspaceId}`,
    });

    await this.workspaceRepository.save(workspace);
  }
}
