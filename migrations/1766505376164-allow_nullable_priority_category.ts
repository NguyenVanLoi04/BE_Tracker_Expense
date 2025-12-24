import { MigrationInterface, QueryRunner } from "typeorm";

export class AllowNullablePriorityCategory1766505376164 implements MigrationInterface {
    name = 'AllowNullablePriorityCategory1766505376164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "priority" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "priority" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "priority" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "priority" SET NOT NULL`);
    }

}
