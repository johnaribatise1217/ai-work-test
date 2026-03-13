import { MigrationInterface, QueryRunner, TableColumn,  } from "typeorm";

export class AddRetryColumn1770000000000 implements MigrationInterface{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "candidate_summaries",
      new TableColumn({
        name: "retry_count",
        type: "int",
        isNullable: false,
        default: 0,
      }),
    )
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("candidate_summaries", "retry_count");
  }

}