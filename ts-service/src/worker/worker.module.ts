import { Module, OnModuleInit } from "@nestjs/common";
import { SummaryProcessor } from "./summary.process";
import { WorkerRunner } from "./summary.worker";
import { CandidateSummary } from "src/candidatesummary/entity/candidate-summary.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CandidateDocument } from "src/candidatedocument/entity/candidate-document.entity";
import { QueueModule } from "src/queue/queue.module";
import { LlmModule } from "src/llm/llm.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CandidateSummary,
      CandidateDocument
    ]),
    QueueModule,
    LlmModule
  ],
  providers: [
    SummaryProcessor,
    WorkerRunner
  ]
})
export class WorkerModule implements OnModuleInit{
  constructor(
    private runner: WorkerRunner
  ){}

  onModuleInit() {
    this.runner.start()
  }
}