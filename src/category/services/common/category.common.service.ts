import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../repositories/category.repository';

@Injectable()
export class CategoryCommonService {
  constructor(private categoryRepo: CategoryRepository) {}

  async checkCategoryCanBeDeleted(categoryId: number) {
    // TODO: check if category can be deleted
    return true;
  }
}
