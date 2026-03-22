import { boolean } from 'boolean';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { NamingStrategy } from './src/common/config/typeorm.config';
import { AppEnvironment } from './src/common/enums/app.enum';
require('dotenv').config();

let config: DataSourceOptions & PostgresConnectionOptions = {
  type: 'postgres',
  // Ưu tiên dùng DATABASE_URL nếu có (Railway), nếu không sẽ fallback về config cũ (Local)
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  port: process.env.DATABASE_URL ? undefined : +process.env.DB_PORT,
  username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_DATABASE,

  // Cấu hình SSL bắt buộc cho các dịch vụ Cloud Database như Railway/Render/Neon
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,

  synchronize: false,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  logger: 'simple-console',
  logging: boolean(process.env.SHOW_SQL),
  migrationsTransactionMode: 'each',
  namingStrategy: new NamingStrategy(),
};

switch (process.env.NODE_ENV) {
  case AppEnvironment.TEST:
    config = {
      ...config,
      logging: false,
      migrationsRun: true,
      entities: ['src/**/*.entity.ts'],
      migrations: ['dist/migrations/*.js'],
      host: process.env.TEST_DB_HOST,
      port: +process.env.TEST_DB_PORT,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_DATABASE,
    };
    break;

  case AppEnvironment.DEVELOPMENT:
    config = {
      ...config,
      synchronize: false,
      migrationsRun: true,
      logging: false,
    };
    break;

  case AppEnvironment.STAGE:
    config = {
      ...config,
      synchronize: false,
      migrationsRun: true,
      logging: false,
    };
    break;

  case AppEnvironment.PRODUCTION:
    config = {
      ...config,
      synchronize: false,
      migrationsRun: true,
      logging: false,
    };
    break;

  // default is local
  default:
    config = {
      ...config,
      synchronize: true,
      migrationsRun: false,
      logging: boolean(process.env.SHOW_SQL),
    };
    break;
}

export const dataSource = new DataSource(config);
