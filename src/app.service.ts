import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MOBILE_ROUTE_DATA } from './common/data/common.data';
import { I18nTranslations } from './i18n/i18n.generated';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async getHello(i18nContext: I18nContext<I18nTranslations>) {
    const result = i18nContext.t('test.params', {
      args: { argument: 'hello' },
    });
    return result;
  }

  async getRoutes() {
    return MOBILE_ROUTE_DATA;
  }
}
