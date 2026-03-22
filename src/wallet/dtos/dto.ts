import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { WalletType } from '../enums/wallet.enum';

export class CreateWalletDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEnum(WalletType)
  @ApiProperty()
  type: WalletType;

  @IsNumber()
  @Min(0)
  @ApiProperty()
  balance: number;
}

export class UpdateWalletDto extends CreateWalletDto {}

export class TransferWalletDto {
  @IsNumber()
  @ApiProperty()
  fromWalletId: number;

  @IsNumber()
  @ApiProperty()
  toWalletId: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  amount: number;
}
