import { Module } from '@nestjs/common';

import { UserRepository } from '../user/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionAdminController } from './controllers/admin/transaction.admin.controller';
import { TransactionCustomerController } from './controllers/customer/transaction.customer.controller';
import { TransactionCustomerService } from './services/customer/transaction.customer.service';
import { CategoryRepository } from '../category/repositories/category.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionAdminService } from './services/admin/transaction.admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionAdminController, TransactionCustomerController],
  providers: [
    TransactionAdminService,
    TransactionCustomerService,
    UserRepository,
    CategoryRepository,
    TransactionRepository,
  ],
  exports: [
    TransactionAdminService,
    TransactionCustomerService,
    UserRepository,
    CategoryRepository,
    TransactionRepository,
  ],
})
export class TransactionModule {}
