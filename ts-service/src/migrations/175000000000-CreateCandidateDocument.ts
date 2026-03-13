import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCandidateDocument1750000000000 implements MigrationInterface{
  
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "candidate_documents",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "64",
            isPrimary: true,
          },
          {
            name: "candidate_id",
            type: "varchar",
            length: "64",
          },
          {
            name: "document_type",
            type: "varchar",
            length: "80",
          },
          {
            name: "file_name",
            type: "varchar",
            length: "250",
          },
          {
            name: "storage_key",
            type: "varchar",
            length: "255",
          },
          {
            name: "raw_text",
            type: "text",
            isNullable: true,
          },
          {
            name: "uploaded_at",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "created_at",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "candidate_documents",
      new TableForeignKey({
        name: "fk_candidate_documents_candidate_id",
        columnNames: ["candidate_id"],
        referencedTableName: "candidates",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
    
    await queryRunner.createIndex(
      "candidate_documents",
      new TableIndex({
        name: "idx_candidate_documents_candidate_id",
        columnNames: ["candidate_id"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex('candidate_documents', 'idx_candidate_documents_candidate_id');
    await queryRunner.dropForeignKey(
      'candidate_documents',
      'fk_candidate_documents_candidate_id',
    );
    await queryRunner.dropTable('candidate_documents');
  }
  
}