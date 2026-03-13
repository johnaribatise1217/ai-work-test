import { Module } from '@nestjs/common';
import { CandidatedocumentService } from './candidatedocument.service';
import { CandidatedocumentController } from './candidatedocument.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from 'src/candidate/entity/candidate.entity';
import { CandidateDocument } from './entity/candidate-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateDocument, Candidate])],
  controllers: [CandidatedocumentController],
  providers: [CandidatedocumentService],
})
export class CandidatedocumentModule {}
