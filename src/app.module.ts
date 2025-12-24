import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { dataSource } from '../data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import globalConfig, { GlobalConfig } from './common/config/global.config';
import { UtilsModule } from './utils/utils.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      maxListeners: 20,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => globalConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        try {
          initializeTransactionalContext();
          const ds = addTransactionalDataSource(dataSource);
          console.log('✅ Database connected successfully');
          return ds;
        } catch (err) {
          console.error('❌ Database connection failed:', err);
          throw err;
        }
      },
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: { path: path.join(__dirname, 'i18n'), watch: true },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['lang', 'l']),
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(process.cwd(), '/src/i18n/i18n.generated.ts'),
    }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),
    ScheduleModule.forRoot(),
    UtilsModule,
    CategoryModule,
    UserModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {}
}
