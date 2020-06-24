import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStampTypeCategories1593019876778
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stamp_type_categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'type_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            name: 'StampType',
            referencedTableName: 'stamp_types',
            referencedColumnNames: ['id'],
            columnNames: ['type_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stamp_type_categories');
  }
}
