import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateCandidateFields1730000000000 implements MigrationInterface{

  public async up(queryRunner: QueryRunner): Promise<any> {
    // make email NOT NULL
    await queryRunner.changeColumn(
      "candidates",
      "email",
      new TableColumn({
        name: "email",
        type: "varchar",
        length: "160",
        isNullable: false,
      }),
    );

    // rename phoneNumber to phone_number
    await queryRunner.query(`
      ALTER TABLE candidates
      RENAME COLUMN "phoneNumber" TO phone_number
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {

    // revert phone_number to phoneNumber
    await queryRunner.query(`
      ALTER TABLE candidates
      RENAME COLUMN phone_number TO "phoneNumber"
    `);

    // revert email back to nullable
    await queryRunner.changeColumn(
      "candidates",
      "email",
      new TableColumn({
        name: "email",
        type: "varchar",
        length: "160",
        isNullable: true,
      }),
    );
  }
  
}