import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './repositories/wallet.repository';
import { WalletCustomerService } from './services/customer/wallet.customer.service';
import { WalletCustomerController } from './controllers/customer/wallet.customer.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), UserModule],
  controllers: [WalletCustomerController],
  providers: [WalletRepository, WalletCustomerService],
  exports: [WalletRepository, WalletCustomerService],
})
export class WalletModule {}
