import { BaseEntity } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { CandidateDocument } from '../../candidatedocument/entity/candidate-document.entity';
import { CandidateSummary } from '../../candidatesummary/entity/candidate-summary.entity';

@Entity({name: "candidates"})
export class Candidate extends BaseEntity{
  @Column({ name: 'workspace_id', type: 'varchar', length: 64 })
  workspaceId!: string;

  @Column({ name: 'recruiter_id', type: 'varchar', length: 64 })
  recruiterId!: string; //creator of the candidate

  @Column({ name: 'full_name', type: 'varchar', length: 160 })
  fullName!: string;

  @Column({name: 'email', type: 'varchar', length: 160, unique: true})
  email!: string

  @Column({name: "phone_number", type: 'varchar', length: 160, unique: true})
  phoneNumber!: string  

  @ManyToOne(() => Workspace, (workspace) => workspace.candidates, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({name: 'workspace_id'})
  workspace!: Workspace

  @OneToMany(() => CandidateDocument, (document) => document.candidate)
  documents!: CandidateDocument[]

  @OneToMany(() => CandidateSummary, (summary) => summary.candidate)
  summaries!: CandidateSummary[];
}