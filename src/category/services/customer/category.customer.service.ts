import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { paginate } from 'nestjs-typeorm-paginate';
import { AppResponseDto } from '../../../common/dtos/app-response.dto';
import { CategoryResDto } from '../../dtos/common/res/category.res.dto';
import { GetListCategoryCustomerReqDto } from '../../dtos/customer/req/category.customer.req.dto';
import { CategoryStatus } from '../../enums/category.enum';
import { CategoryRepository } from '../../repositories/category.repository';
import { UserDto } from '../../../auth/dtos/dto';
import {
  CreateCategoryReqDto,
  UpdateCategoryMerchantReqDto,
} from '../../dtos/merchant/req/category.merchant.req.dto';
import { UserRepository } from '../../../user/repositories/user.repository';

@Injectable()
export class CategoryCustomerService {
  constructor(
    private categoryRepo: CategoryRepository,
    private UserRepository: UserRepository,
  ) {}

  async getListDefaultCategory() {
    const categoryDefault = await this.categoryRepo
      .createQueryBuilder('category')
      .where('category.deletedAt IS NULL')
      .andWhere('category.isDefault = :isDefault', { isDefault: true })
      .andWhere('category.status = :status', {
        status: CategoryStatus.ACTIVE,
      })
      .getMany();

    return categoryDefault;
  }

  async getCategoryCreatedByCustomer(user: UserDto) {
    const { userId } = user;

    const [categoryDefault, category] = await Promise.all([
      this.categoryRepo
        .createQueryBuilder('category')
        .where('category.deletedAt IS NULL')
        .andWhere('category.isDefault = :isDefault', { isDefault: true })
        .andWhere('category.status = :status', {
          status: CategoryStatus.ACTIVE,
        })
        .getMany(),
      this.categoryRepo
        .createQueryBuilder('category')
        .where('category.user_id = :userId', { userId })
        .andWhere('category.status = :status', {
          status: CategoryStatus.ACTIVE,
        })
        .andWhere('category.deletedAt IS NULL')
        .orderBy('category.id', 'DESC')
        .getMany(),
    ]);

    return categoryDefault.concat(category);
  }

  @Transactional()
  async createCategoryByCustomer(user: UserDto, dto: CreateCategoryReqDto) {
    const { userId } = user;
    const { name, priority, isDefault, status } = dto;

    const userFound = await this.UserRepository.findOne({
      where: { id: userId },
    });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const category = this.categoryRepo.create({
      name,
      priority,
      isDefault: false,
      status,
      user: userFound,
    });

    return this.categoryRepo.save(category);
  }

  @Transactional()
  async updateCategoryByCustomer(
    id: number,
    user: UserDto,
    dto: UpdateCategoryMerchantReqDto,
  ) {
    const { userId } = user;

    const categoryFound = await this.categoryRepo
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .andWhere('category.user_id = :userId', { userId })
      .getOne();

    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }

    const categoryNew = this.categoryRepo.merge(categoryFound, dto);

    try {
      return this.categoryRepo.save(categoryNew);
    } catch (error) {
      throw new InternalServerErrorException('Category update failed');
    }
  }

  @Transactional()
  async deleteCategoryByCustomer(categoryId: number, user: UserDto) {
    const { userId } = user;

    const category = await this.categoryRepo
      .createQueryBuilder('category')
      .where('category.id = :id', { id: categoryId })
      .andWhere('category.user_id = :userId', { userId })
      .getOne();
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const result = await this.categoryRepo.softDelete(category.id);

    if (!result.affected) {
      throw new InternalServerErrorException('Category deteled failed');
    }
  }
}
//  return AppResponseDto.fromNestJsPagination(categories, meta);
