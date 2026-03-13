import { Injectable, Logger } from "@nestjs/common";
import { QueueService } from "src/queue/queue.service";
import { SummaryProcessor } from "./summary.process";

@Injectable()
export class WorkerRunner{
  constructor(
    private readonly queue: QueueService,
    private readonly processor: SummaryProcessor,
  ) {}

  private readonly logger = new Logger(WorkerRunner.name)

  start(){
    setInterval(async () => {
      //check queue
      const job = this.queue.dequeue()
      if(!job) return
      //take the job
      if(job.name === "candidate-summary-generation"){
        const {summaryId, candidateId} = job.payload as any
        //process it
        this.logger.log(`Summary generation started successfully for candidate ${candidateId}`);
        await this.processor.process(summaryId, candidateId)
      }
    }, 3000) //poll every 3 seconds on application startup
  }
}