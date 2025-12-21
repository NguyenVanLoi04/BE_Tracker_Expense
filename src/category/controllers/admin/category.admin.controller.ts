import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  CreateCategoryReqDto,
  DeleteCategoriesMerchantReqDto,
  GetListCategoryMerchantReqDto,
  UpdateCategoryMerchantReqDto,
} from '../../dtos/merchant/req/category.merchant.req.dto';
import { CategoryMerchantService } from '../../services/merchant/category.merchant.service';
import { CurrentUser } from '../../../common/decorators/curent.user.decorator';

@Controller(`${PrefixType.ADMIN}/categories`)
@ApiTags('Category Admin')
export class CategoryMerchantController {
  constructor(
    private readonly categoryMerchantService: CategoryMerchantService,
  ) {}

  @ApiBearerAuth('access-token')
  @Get()
  getList(
    @CurrentUser() id: number,
    @Query() dto: GetListCategoryMerchantReqDto,
  ) {
    console.log('dto ::::::::::::', dto);
    console.log('id ::::::::::::', id);
    return this.categoryMerchantService.getListCategory();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return;
  }

  @Post()
  create(@Body() dto: CreateCategoryReqDto) {
    return;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryMerchantReqDto,
  ) {
    return;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return;
  }

  @Delete()
  deleteMultiple(@Body() dto: DeleteCategoriesMerchantReqDto) {
    return;
  }
}
