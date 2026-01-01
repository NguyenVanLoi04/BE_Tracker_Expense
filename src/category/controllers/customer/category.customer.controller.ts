import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PrefixType } from '../../../common/constants/global.constant';
import { CurrentUser } from '../../../common/decorators/curent.user.decorator';
import { UserDto } from '../../../auth/dtos/dto';
import { CategoryCustomerService } from '../../services/customer/category.customer.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateCategoryReqDto,
  UpdateCategoryMerchantReqDto,
} from '../../dtos/merchant/req/category.merchant.req.dto';
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
  ) {
    return this.CategoryCustomerService.createCategoryByCustomer(user, dto);
  }

  @Put(':id')
  updateCategoryByCustomer(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
    @Body() dto: UpdateCategoryMerchantReqDto,
  ) {
    return this.CategoryCustomerService.updateCategoryByCustomer(id, user, dto);
  }

  @Delete(':id')
  deleteCategoryByCustomer(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ) {
    return this.CategoryCustomerService.deleteCategoryByCustomer(id, user);
  }
}
