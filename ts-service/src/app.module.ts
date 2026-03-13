import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { defaultDatabaseUrl, getTypeOrmOptions } from './config/typeorm.options';
import { HealthModule } from './health/health.module';
import { LlmModule } from './llm/llm.module';
import { QueueModule } from './queue/queue.module';
import { SampleModule } from './sample/sample.module';
import { CandidateModule } from './candidate/candidate.module';
import { CandidatedocumentModule } from './candidatedocument/candidatedocument.module';
import { CandidatesummaryModule } from './candidatesummary/candidatesummary.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmOptions(configService.get<string>('DATABASE_URL') ?? defaultDatabaseUrl),
    }),
    AuthModule,
    HealthModule,
    QueueModule,
    LlmModule,
    SampleModule,
    CandidateModule,
    CandidatedocumentModule,
    CandidatesummaryModule,
    WorkerModule
  ],
})
export class AppModule {}
