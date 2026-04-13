import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { TransactionAdminService } from '../../services/admin/transaction.admin.service';
import { GetListTransactionDto, TransactionResponseDto } from '../../dtos/dto';
import { Admin } from '../../../common/decorators/admin.decorator';
import { Serialize } from '../../../common/interceptors/serialize.interceptor';

@Controller(`${PrefixType.ADMIN}/transactions`)
@Admin()
@ApiTags('Admin transaction')
export class TransactionAdminController {
  constructor(
    private readonly transactionAdminService: TransactionAdminService,
  ) {}

  @Get()
  @Serialize(TransactionResponseDto)
  getListTransaction(@Query() dto: GetListTransactionDto) {
    return this.transactionAdminService.getListTransaction(dto);
  }
}
