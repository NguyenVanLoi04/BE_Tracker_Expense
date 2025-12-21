import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordUserAgainPro1765881056821 implements MigrationInterface {
    name = 'PasswordUserAgainPro1765881056821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pass_word"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pass_word" character varying(100) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pass_word"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pass_word" character varying(255) NOT NULL DEFAULT ''`);
    }

}
