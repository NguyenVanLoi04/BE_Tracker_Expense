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
  CreateCategoryAdminReqDto,
  CreateCategoryReqDto,
  DeleteCategoriesMerchantReqDto,
  GetListCategoryAdminReqDto,
  GetListCategoryMerchantReqDto,
  UpdateCategoryMerchantReqDto,
} from '../../dtos/merchant/req/category.merchant.req.dto';
import { CategoryAdminService } from '../../services/merchant/category.merchant.service';
import { CurrentUser } from '../../../common/decorators/curent.user.decorator';
import { UserDto } from '../../../auth/dtos/dto';
import { Admin } from '../../../common/decorators/admin.decorator';
import { Serialize } from '../../../common/interceptors/serialize.interceptor';
import { CategoryResDto } from '../../dtos/common/res/category.res.dto';

@Controller(`${PrefixType.ADMIN}/categories`)
@Admin()
@ApiTags('Category Admin')
export class CategoryMerchantController {
  constructor(private readonly categoryAdminService: CategoryAdminService) {}

  @Get()
  @Serialize(CategoryResDto)
  getList(@CurrentUser() id: number, @Query() dto: GetListCategoryAdminReqDto) {
    return this.categoryAdminService.getListCategoryByAdmin(dto);
  }

  @Get(':id')
  @Serialize(CategoryResDto)
  getCategoryByIdWithAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.categoryAdminService.getCategoryById(id);
  }

  @Post()
  @Serialize(CategoryResDto)
  createCategoryWithAdmin(
    @Body() dto: CreateCategoryAdminReqDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.categoryAdminService.createCategoryByAdmin(user, dto);
  }

  @Patch(':id')
  @Serialize(CategoryResDto)
  updateCategoryWithAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCategoryAdminReqDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.categoryAdminService.updateCategoryByAdmin(id, user, dto);
  }

  @Delete(':id')
  deleteCategoryWithAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.categoryAdminService.deleteCategoryById(id);
  }
}
