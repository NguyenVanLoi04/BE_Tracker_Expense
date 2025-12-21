import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';

@Controller(`${PrefixType.CUSTOMER}/transactions`)
@ApiTags('Customer transaction')
export class TransactionCustomerController {
  constructor() {}

  @Get()
  getListTransaction() {}
}
