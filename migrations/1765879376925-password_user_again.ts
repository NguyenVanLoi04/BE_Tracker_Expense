import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordUserAgain1765879376925 implements MigrationInterface {
    name = 'PasswordUserAgain1765879376925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pass_word"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pass_word" character varying(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pass_word"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pass_word" character varying(20) NOT NULL`);
    }

}
