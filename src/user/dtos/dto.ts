import { IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsValidText } from '../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetListUserDto extends PaginationReqDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  status?: boolean;
}

export class UserResponseDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() userName: string;
  @Expose() isAdmin: boolean;
  @Expose() isBlock: boolean;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() categoryCount: number;
  @Expose() transactionCount: number;
}
