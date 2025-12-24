import { Module } from '@nestjs/common';
import { CategoryMerchantController } from './controllers/admin/category.admin.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryCommonService } from './services/common/category.common.service';
import { CategoryCustomerService } from './services/customer/category.customer.service';
import { CategoryAdminService } from './services/merchant/category.merchant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryCustomerController } from './controllers/customer/category.customer.controller';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryMerchantController, CategoryCustomerController],
  providers: [
    CategoryRepository,
    CategoryAdminService,
    CategoryCustomerService,
    CategoryCommonService,
    UserRepository,
  ],
  exports: [
    CategoryRepository,
    CategoryAdminService,
    CategoryCustomerService,
    CategoryCommonService,
    UserRepository,
  ],
})
export class CategoryModule {}
