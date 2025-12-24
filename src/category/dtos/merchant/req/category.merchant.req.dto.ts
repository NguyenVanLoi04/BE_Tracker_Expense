import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsValidArrayNumber,
  IsValidBoolean,
  IsValidEnum,
  IsValidNumber,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../../common/dtos/pagination.dto';
import { SortType } from '../../../../common/enums/sort.enum';
import {
  CategorySortField,
  CategoryStatus,
} from '../../../enums/category.enum';

export class CreateCategoryReqDto {
  @ApiProperty({ example: 'name' })
  @IsValidText({ maxLength: 255 })
  name: string;

  @ApiProperty({ example: 0 })
  priority: number;

  @ApiProperty({ example: false })
  @IsValidBoolean()
  isDefault: boolean;

  @ApiProperty({ example: CategoryStatus.ACTIVE })
  @IsValidEnum({
    enum: CategoryStatus,
  })
  status: CategoryStatus;
}

export class UpdateCategoryMerchantReqDto extends PartialType(
  CreateCategoryReqDto,
) {
  @ApiProperty({ example: 'id' })
  @IsValidNumber()
  id: number;
}

export class DeleteCategoriesMerchantReqDto {
  @IsValidArrayNumber({ minSize: 1, required: true })
  ids: number[];
}

export class GetListCategoryMerchantReqDto extends PaginationReqDto {
  @IsValidText({
    required: false,
  })
  name?: string;

  @IsValidEnum({
    enum: CategoryStatus,
    required: false,
  })
  status?: CategoryStatus;

  @IsValidEnum({
    enum: CategorySortField,
    required: false,
  })
  sortField?: CategorySortField;

  @IsValidEnum({
    enum: SortType,
    required: false,
  })
  sortType?: SortType;
}

export class GetListCategoryAdminReqDto extends PaginationReqDto {
  @IsValidText({
    required: false,
  })
  name?: string;

  @IsValidEnum({
    enum: CategoryStatus,
    required: false,
  })
  status?: CategoryStatus;
}

export class CreateCategoryAdminReqDto {
  @ApiProperty()
  @IsValidText({ required: true, maxLength: 255 })
  name: string;

  @ApiProperty()
  @IsValidEnum({
    enum: CategoryStatus,
    required: true,
  })
  status: CategoryStatus;

  @ApiProperty()
  @IsValidNumber({
    required: false,
  })
  priority: number;

  @ApiProperty()
  @IsValidBoolean({
    required: false,
    default: false,
  })
  isDefault: boolean;

  @ApiProperty()
  @IsValidNumber({
    required: true,
  })
  userId: number;
}
