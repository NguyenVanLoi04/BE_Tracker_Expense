import { Module } from '@nestjs/common';
import { UserCustomerController } from './controllers/customer/user.customer.controller';
import { UserAdminController } from './controllers/admin/user.admin.controller';
import { UserAdminService } from './services/admin/user.admin.service';
import { UserCustomerService } from './services/customer/user.customer.service';
import { UserRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [],
  controllers: [UserCustomerController, UserAdminController],
  providers: [UserAdminService, UserCustomerService, UserRepository],
  exports: [UserAdminService, UserCustomerService, UserRepository],
})
export class UserModule {}
