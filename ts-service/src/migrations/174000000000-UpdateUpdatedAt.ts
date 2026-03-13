import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateUpdatedAt1740000000000 implements MigrationInterface{
  
  public async up(queryRunner: QueryRunner): Promise<any> {
    //update nullable field on updated_at column
    await queryRunner.changeColumn(
      "candidates",
      "updated_at",
      new TableColumn({
        name: "updated_at",
        type: "timestamptz",
        isNullable: true, //formerly false
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    //REVERT update nullable field on updated_at column
    await queryRunner.changeColumn(
      "candidates",
      "updated_at",
      new TableColumn({
        name: "updated_at",
        type: "timestamptz",
        isNullable: false,
      })
    )
  }

}