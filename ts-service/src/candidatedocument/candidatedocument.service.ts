import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateDocument } from './entity/candidate-document.entity';
import { Candidate } from 'src/candidate/entity/candidate.entity';
import { FileStorageUtil } from './utils/FileStorageUtil';
import { randomUUID } from 'crypto';
import { AuthUser } from 'src/auth/auth.types';

@Injectable()
export class CandidatedocumentService {
  constructor(
    @InjectRepository(CandidateDocument)
    private readonly documentRepository: Repository<CandidateDocument>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>
  ){}

  async uploadDocument(
    user: AuthUser,
    candidateId: string,
    file: Express.Multer.File
  ): Promise<CandidateDocument>{
    const candidate = await this.getCandidateById(user.workspaceId, candidateId)
    const processedFile = await FileStorageUtil.processFile(file)

    const document = this.documentRepository.create({
      id: randomUUID(),
      candidateId: candidate?.id,
      documentType: processedFile.documentType,
      fileName: processedFile.fileName,
      storageKey: processedFile.storageKey,
      rawText: processedFile.rawText,
    })

    return this.documentRepository.save(document)
  }

  private async getCandidateById(workspaceId: string, candidateId: string)
   : Promise<Candidate | null>{
    const candidate = await this.candidateRepository.findOne({
      where: {
        id: candidateId,
        workspaceId
      }
    })

    if(!candidate){
      throw new NotFoundException("Candidate Not Found")
    }

    return candidate;
  }
}
