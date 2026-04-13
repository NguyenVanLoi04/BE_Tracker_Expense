import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { Category } from '../../../entities/category.entity';
import { Expose } from 'class-transformer';
import { CategoryStatus } from '../../../enums/category.enum';

export interface CategoryResDtoParams extends BaseResponseDtoParams {
  data: Category;
}

export class CategoryResDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() priority: number;
  @Expose() status: CategoryStatus;
  @Expose() color: string;
  @Expose() icon: string;
  @Expose() isDefault: boolean;
  @Expose() type: string;

  static mapProperty(dto: CategoryResDto, data: Category) {
    dto.id = data.id;
    dto.name = data.name;
    dto.priority = data.priority;
    dto.status = data.status;
    dto.color = data.color;
    dto.icon = data.icon;
    dto.isDefault = data.isDefault;
    dto.type = data.type;
  }

  static forCustomer(params: CategoryResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new CategoryResDto();

    this.mapProperty(result, data);

    return result;
  }

  static forMerchant(params: CategoryResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new CategoryResDto();

    this.mapProperty(result, data);

    return result;
  }

  static forAdmin(params: CategoryResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new CategoryResDto();

    this.mapProperty(result, data);

    return result;
  }
}
