import { BaseEntity } from './base.entity';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity({name: "workspaces"})
export class Workspace extends BaseEntity{
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @OneToMany(() => Candidate, (candidate) => candidate.workspaceId)
  candidates!: Candidate[]
}