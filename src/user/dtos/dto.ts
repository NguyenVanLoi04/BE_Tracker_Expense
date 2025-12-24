import { IsBoolean } from 'class-validator';
import { IsValidText } from '../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetListUserDto extends PaginationReqDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  status?: boolean;
}
