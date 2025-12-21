import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(Category, dataSource);
    this.entityNameI18nKey = 'common.word.category';
  }
}
