import {
  DEFAULT_REDIS,
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { GlobalConfig } from './global.config';

export const redisConfig: RedisModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory(configService: ConfigService<GlobalConfig>) {
    const host = configService.get('redis.standAlone.host');
    const port = configService.get('redis.standAlone.port');
    const password = configService.get('redis.password');

    const redisConfig: RedisModuleOptions = {
      readyLog: true,
      errorLog: true,
      config: {
        host,
        port,
        password,
        namespace: DEFAULT_REDIS,
        maxRetriesPerRequest: 3,
      },
    };

    return redisConfig;
  },
};
