import { Module } from '@nestjs/common';
import { CategoryMerchantController } from './controllers/admin/category.admin.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryCommonService } from './services/common/category.common.service';
import { CategoryCustomerService } from './services/customer/category.customer.service';
import { CategoryMerchantService } from './services/merchant/category.merchant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryCustomerController } from './controllers/customer/category.customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryMerchantController, CategoryCustomerController],
  providers: [
    CategoryRepository,
    CategoryMerchantService,
    CategoryCustomerService,
    CategoryCommonService,
  ],
  exports: [
    CategoryRepository,
    CategoryMerchantService,
    CategoryCustomerService,
    CategoryCommonService,
  ],
})
export class CategoryModule {}
