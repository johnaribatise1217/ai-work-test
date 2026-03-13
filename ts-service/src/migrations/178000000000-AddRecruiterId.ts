import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRecruiterId1780000000000 implements MigrationInterface{
  
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "candidates",
      new TableColumn({
        name: "recruiter_id",
        type: "varchar",
        length: '64',
        isNullable: true
      })
    )
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("candidates", "recruiter_id")
  }
}