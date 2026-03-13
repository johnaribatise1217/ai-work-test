import { BaseEntity } from '../../candidate/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Candidate } from '../../candidate/entity/candidate.entity';

@Entity({name: "candidate_documents"})
export class CandidateDocument extends BaseEntity{
  @Column({ name: "candidate_id", type: "varchar", length: 64 })
  candidateId!: string;

  @Column({ name: "document_type", type: "varchar", length: 80 })
  documentType!: string;

  @Column({ name: "file_name", type: "varchar", length: 250 })
  fileName!: string;

  @Column({ name: "storage_key", type: "varchar", length: 255 })
  storageKey!: string;

  @Column({ name: "raw_text", type: "text", nullable: true })
  rawText!: string;

  @Column({ name: "uploaded_at", type: "timestamptz", default: () => "now()" })
  uploadedAt!: Date;

  @ManyToOne(() => Candidate, (candidate) => candidate.documents, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "candidate_id" })
  candidate!: Candidate;
}