import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateCandidate1720000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'workspaces',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '64',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: "updated_at",
            type: 'timestamptz',
            isNullable: true,
          }
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'candidates',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '64',
            isPrimary: true,
          },
          {
            name: 'workspace_id',
            type: 'varchar',
            length: '64',
            isNullable: false,
          },
          {
            name: 'full_name',
            type: 'varchar',
            length: '160',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '160',
            isNullable: true,
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            length: '160',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'candidates',
      new TableForeignKey({
        name: 'fk_candidates_workspace_id',
        columnNames: ['workspace_id'],
        referencedTableName: 'workspaces',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'candidates',
      new TableIndex({
        name: 'idx_candidates_workspace_id',
        columnNames: ['workspace_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('candidates', 'idx_candidates_workspace_id');
    await queryRunner.dropForeignKey(
      'candidates',
      'fk_candidates_workspace_id',
    );
    await queryRunner.dropTable('candidates');
    await queryRunner.dropTable('workspaces');
  }
}