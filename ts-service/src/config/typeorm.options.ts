import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { SampleCandidate } from '../entities/sample-candidate.entity';
import { SampleWorkspace } from '../entities/sample-workspace.entity';
import { InitialStarterEntities1710000000000 } from '../migrations/1710000000000-InitialStarterEntities';
import { Candidate } from '../candidate/entity/candidate.entity';
import { Workspace } from '../candidate/entity/workspace.entity';
import { CreateCandidate1720000000000 } from '../migrations/172000000000-CreateCandidate';
import { BaseEntity } from '../candidate/entity/base.entity';
import { UpdateCandidateFields1730000000000 } from '../migrations/173000000000-UpdateCandidateFields';
import { UpdateUpdatedAt1740000000000 } from '../migrations/174000000000-UpdateUpdatedAt';
import { CandidateDocument } from '../candidatedocument/entity/candidate-document.entity';
import { CreateCandidateDocument1750000000000 } from '../migrations/175000000000-CreateCandidateDocument';
import { CreateCandidateSummary1760000000000 } from '../migrations/176000000000-CreateCandidateSummary';
import { CandidateSummary } from '../candidatesummary/entity/candidate-summary.entity';
import { AddRetryColumn1770000000000 } from '../migrations/177000000000-AddRetryColumn';
import { AddRecruiterId1780000000000 } from '../migrations/178000000000-AddRecruiterId';

export const defaultDatabaseUrl =
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

export const getTypeOrmOptions = (
  databaseUrl: string,
): TypeOrmModuleOptions & DataSourceOptions => ({
  type: 'postgres',
  url: databaseUrl,
  entities: [SampleWorkspace, SampleCandidate, Candidate, Workspace, BaseEntity, CandidateDocument, CandidateSummary],
  migrations: [
    InitialStarterEntities1710000000000, 
    CreateCandidate1720000000000, 
    UpdateCandidateFields1730000000000, 
    UpdateUpdatedAt1740000000000,
    CreateCandidateDocument1750000000000,
    CreateCandidateSummary1760000000000,
    AddRetryColumn1770000000000,
    AddRecruiterId1780000000000
  ],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: false,
});
