import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStamps1593021067347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stamps',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'cod',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
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
          {
            name: 'category_id',
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
          {
            name: 'StampTypeCategory',
            referencedTableName: 'stamp_type_categories',
            referencedColumnNames: ['id'],
            columnNames: ['category_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stamps');
  }
}
