import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { UserCustomerService } from '../../services/customer/user.customer.service';

@Controller(`${PrefixType.CUSTOMER}/users`)
@ApiTags('User Customer')
export class UserCustomerController {
  constructor(private readonly userCustomerService: UserCustomerService) {}

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return;
  }
}
