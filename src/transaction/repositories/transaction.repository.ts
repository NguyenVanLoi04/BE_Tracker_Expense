import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource);
    this.entityNameI18nKey = 'common.word.noti';
  }
}
