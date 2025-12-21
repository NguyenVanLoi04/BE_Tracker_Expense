import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';

@Controller(`${PrefixType.ADMIN}/transactions`)
@ApiTags('Admin transaction')
export class TransactionAdminController {
  constructor() {}

  @Get()
  getListTransaction() {}
}
