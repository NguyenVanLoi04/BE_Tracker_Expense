import { UserRepository } from './../../../user/repositories/user.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CategoryRepository } from '../../repositories/category.repository';
import { CategoryCommonService } from '../common/category.common.service';
import {
  CreateCategoryAdminReqDto,
  GetListCategoryAdminReqDto,
} from '../../dtos/merchant/req/category.merchant.req.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { CategoryStatus } from '../../enums/category.enum';
import { UserDto } from '../../../auth/dtos/dto';

@Injectable()
export class CategoryAdminService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getListCategoryByAdmin(dto: GetListCategoryAdminReqDto) {
    const { name, status, page, limit } = dto;
    const query = this.categoryRepo
      .createQueryBuilder('category')
      .where('category.deletedAt IS NULL');

    if (name) {
      query.andWhere('category.name LIKE :name', { name: `%${name}%` });
    }

    if (status) {
      query.andWhere('category.status = :status', { status });
    }
    query.leftJoin('category.user', 'user').addSelect('user.id', 'userId');
    query.orderBy('category.id', 'ASC');

    const result = await paginate(query, { page, limit });

    return result;
  }

  async checkCategoryCanBeDeleted(categoryId: number) {
    const categoryCanDelete = await this.categoryRepo
      .createQueryBuilder('category')
      .where('category.id = :id', { id: categoryId })
      .andWhere('category.deletedAt IS NULL')
      .andWhere('category.status = :status', { status: CategoryStatus.ACTIVE })
      .andWhere('category.isDefault = :isDefault', { isDefault: false })
      .getOne();

    return categoryCanDelete ? true : false;
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .leftJoinAndSelect('category.user', 'user')
      .getOne();

    return category;
  }

  async deleteCategoryById(id: number) {
    const categoryCanDelete = await this.checkCategoryCanBeDeleted(id);

    if (!categoryCanDelete) {
      throw new Error('Category can not be deleted');
    }
    return this.categoryRepo.softDelete(id);
  }

  async createCategoryByAdmin(user: UserDto, dto: CreateCategoryAdminReqDto) {
    const { name, priority, isDefault, status } = dto;
    const userFound = await this.userRepository.findOneBy({ id: user.userId });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    const categoryFound = await this.categoryRepo
      .createQueryBuilder('category')
      .where('category.name = :name', { name: name.trim() })
      .andWhere('category.deletedAt IS NULL')
      .andWhere('category.user_id = :userId', { userId: userFound.id })
      .getOne();

    if (categoryFound) {
      throw new BadRequestException('Category name already exist');
    }
    const category = this.categoryRepo.create({
      name: name.trim(),
      priority,
      isDefault,
      status,
      user: { id: userFound.id },
    });

    return this.categoryRepo.save(category);
  }

  async updateCategoryByAdmin(
    id: number,
    user: UserDto,
    dto: CreateCategoryAdminReqDto,
  ) {
    const { name, priority, isDefault, status } = dto;
    const userFound = await this.userRepository.findOneBy({ id: user.userId });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    const categoryFound = await this.categoryRepo
      .createQueryBuilder('category')
      .where('category.name = :name', { name: name.trim() })
      .andWhere('category.deletedAt IS NULL')
      .andWhere('category.user_id = :userId', { userId: userFound.id })
      .getOne();

    if (categoryFound) {
      throw new BadRequestException('Category name already exist');
    }

    const newCategory = this.categoryRepo.merge(categoryFound, dto);
    return this.categoryRepo.save(newCategory);
  }
}
