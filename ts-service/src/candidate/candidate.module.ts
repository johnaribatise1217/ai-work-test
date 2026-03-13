import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entity/workspace.entity';
import { Candidate } from './entity/candidate.entity';
import { CandidateDocument } from '../candidatedocument/entity/candidate-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, Candidate, CandidateDocument])],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [CandidateService]
})
export class CandidateModule {}
