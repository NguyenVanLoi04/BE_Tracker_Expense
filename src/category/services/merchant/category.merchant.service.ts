import { Injectable } from '@nestjs/common';

import { CategoryRepository } from '../../repositories/category.repository';
import { CategoryCommonService } from '../common/category.common.service';

@Injectable()
export class CategoryMerchantService {
  constructor(
    private categoryRepo: CategoryRepository,
    private categoryCommonService: CategoryCommonService,
  ) {}

  async getListCategory() {
    const categories = await this.categoryRepo
      .createQueryBuilder('category')
      .select(['category.id', 'category.name'])
      .leftJoinAndSelect('category.user', 'user')
      .getMany();

    return categories;
  }
}
