import { PartialType } from '@nestjs/swagger';
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
  @IsValidText({ maxLength: 255 })
  name: string;

  @IsValidNumber()
  priority: number;

  @IsValidBoolean()
  isDefault: boolean;

  @IsValidEnum({
    enum: CategoryStatus,
  })
  status: CategoryStatus;
}

export class UpdateCategoryMerchantReqDto extends PartialType(
  CreateCategoryReqDto,
) {
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
