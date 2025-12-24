import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TransactionType } from './../enums/enum';
import { Type } from 'class-transformer';
import { PaginationReqDto } from '../../common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTransactionDto {
  @IsNumber()
  @Min(0)
  @ApiProperty()
  amount: number;
  @IsString()
  @ApiProperty()
  note?: string;

  @IsEnum(TransactionType)
  @ApiProperty()
  type: TransactionType;

  @IsDateString()
  @ApiProperty()
  transactionDate: string;

  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  categoryId: number;
}

export class UpdateTransactionDto extends CreateTransactionDto {
  id: number;
}

export class GetListTransactionDto extends PaginationReqDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
