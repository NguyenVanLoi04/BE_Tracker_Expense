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
import { Expose, Type } from 'class-transformer';
import { CategoryResDto } from '../../category/dtos/common/res/category.res.dto';
// import { WalletResponseDto } from '../../wallet/dtos/dto';
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

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @Type(() => Number)
  walletId?: number;
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

export class TransactionResponseDto {
  @Expose() id: number;
  @Expose() amount: number;
  @Expose() note: string;
  @Expose() type: TransactionType;
  @Expose() transactionDate: Date;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  @Expose()
  @Type(() => CategoryResDto)
  category: CategoryResDto;

  /*
  @Expose()
  @Type(() => WalletResponseDto)
  wallet: WalletResponseDto;
  */

  @Expose()
  categoryName?: string;

  @Expose()
  totalAmount?: number;
}
