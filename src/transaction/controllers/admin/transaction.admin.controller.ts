import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { TransactionAdminService } from '../../services/admin/transaction.admin.service';
import { GetListTransactionDto } from '../../dtos/dto';

@Controller(`${PrefixType.ADMIN}/transactions`)
@ApiTags('Admin transaction')
export class TransactionAdminController {
  constructor(
    private readonly transactionAdminService: TransactionAdminService,
  ) {}

  @Get()
  getListTransaction(@Query() dto: GetListTransactionDto) {
    return this.transactionAdminService.getListTransaction(dto);
  }
}
