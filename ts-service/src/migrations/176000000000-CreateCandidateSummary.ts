import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCandidateSummary1760000000000 implements MigrationInterface{
  
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "candidate_summaries",
        columns: [
          { name: "id", type: "varchar", length: "64", isPrimary: true },

          { name: "candidate_id", type: "varchar", length: "64" },

          { name: "status", type: "varchar", length: "20" },

          { name: "score", type: "int", isNullable: true },

          { name: "strengths", type: "jsonb", isNullable: true },

          { name: "concerns", type: "jsonb", isNullable: true },

          { name: "summary", type: "text", isNullable: true },

          { name: "recommended_decision", type: "varchar", length: "20", isNullable: true },

          { name: "provider", type: "varchar", length: "40" },

          { name: "prompt_version", type: "varchar", length: "40" },

          { name: "error_message", type: "text", isNullable: true },

          { name: "created_at", type: "timestamptz", default: "now()" },

          { name: "updated_at", type: "timestamptz", default: "now()", isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "candidate_summaries",
      new TableForeignKey({
        name: "fk_candidate_summaries_candidate_id",
        columnNames: ["candidate_id"],
        referencedTableName: "candidates",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
    
    await queryRunner.createIndex(
      "candidate_summaries",
      new TableIndex({
        name: "idx_candidate_summaries_candidate_id",
        columnNames: ["candidate_id"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex('candidate_summaries', 'idx_candidate_summaries_candidate_id');
    await queryRunner.dropForeignKey(
      'candidate_summaries',
      'fk_candidate_summaries_candidate_id',
    );
    await queryRunner.dropTable('candidate_summaries');
  }

}