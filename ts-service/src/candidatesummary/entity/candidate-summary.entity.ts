import { BaseEntity } from "../../candidate/entity/base.entity";
import { Candidate } from "../../candidate/entity/candidate.entity";

import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

export type SummaryStatus = "pending" | "completed" | "failed";

@Entity({ name: "candidate_summaries" })
export class CandidateSummary extends BaseEntity {

  @Column({ name: "candidate_id", type: "varchar", length: 64 })
  candidateId!: string;

  @Column({ type: "varchar", length: 20 })
  status!: SummaryStatus;

  @Column({ type: "int", nullable: true })
  score!: number | null;

  @Column({ type: "jsonb", nullable: true })
  strengths!: string[];

  @Column({ type: "jsonb", nullable: true })
  concerns!: string[];

  @Column({ type: "text", nullable: true })
  summary!: string;

  @Column({ name: "recommended_decision", type: "varchar", length: 20, nullable: true })
  recommendedDecision!: string;

  @Column({ type: "varchar", length: 40 })
  provider!: string;

  @Column({ name: "prompt_version", type: "varchar", length: 40 })
  promptVersion!: string;

  @Column({ name: "error_message", type: "text", nullable: true })
  errorMessage!: string | null;

  @Column({ name: "retry_count", type: "int", default: 0 })
  retryCount!: number;

  @ManyToOne(() => Candidate, (candidate) => candidate.summaries, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "candidate_id" })
  candidate!: Candidate;
}