import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsAdminUser1766569783465 implements MigrationInterface {
    name = 'AddColumnIsAdminUser1766569783465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_admin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_admin"`);
    }

}
