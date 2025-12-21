import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrefixType } from '../../../common/constants/global.constant';
import { CurrentUser } from '../../../common/decorators/curent.user.decorator';
import { UserDto } from '../../../auth/dtos/dto';
import { CategoryCustomerService } from '../../services/customer/category.customer.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryReqDto } from '../../dtos/merchant/req/category.merchant.req.dto';
@Controller(`${PrefixType.CUSTOMER}/category`)
@ApiTags('Category Customer')
export class CategoryCustomerController {
  constructor(
    private readonly CategoryCustomerService: CategoryCustomerService,
  ) {}

  @Get()
  getCategoryCreatedByCustomer(@CurrentUser() user: UserDto) {
    return this.CategoryCustomerService.getCategoryCreatedByCustomer(user);
  }

  @Post()
  createCategoryByCustomer(
    @CurrentUser() user: UserDto,
    @Body() dto: CreateCategoryReqDto,
  ) {}
}
