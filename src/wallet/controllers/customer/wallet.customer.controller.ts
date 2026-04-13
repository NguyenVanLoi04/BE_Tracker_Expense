import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { CurrentUser } from '../../../common/decorators/curent.user.decorator';
import { UserDto } from '../../../auth/dtos/dto';
import { WalletCustomerService } from '../../services/customer/wallet.customer.service';
import {
  CreateWalletDto,
  TransferWalletDto,
  UpdateWalletDto,
  WalletResponseDto,
} from '../../dtos/dto';
import { Serialize } from '../../../common/interceptors/serialize.interceptor';

@Controller(`${PrefixType.CUSTOMER}/wallets`)
@ApiTags('Customer wallet')
export class WalletCustomerController {
  constructor(private readonly walletCustomerService: WalletCustomerService) {}

  @Get()
  @Serialize(WalletResponseDto)
  getListWallet(@CurrentUser() user: UserDto) {
    return this.walletCustomerService.getListWalletByUser(user);
  }

  @Get(':id')
  @Serialize(WalletResponseDto)
  getWalletById(
    @CurrentUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.walletCustomerService.getWalletById(id, user);
  }

  @Post()
  @Serialize(WalletResponseDto)
  createWallet(@CurrentUser() user: UserDto, @Body() dto: CreateWalletDto) {
    return this.walletCustomerService.createWallet(user, dto);
  }

  @Post('transfer')
  transferMoney(@CurrentUser() user: UserDto, @Body() dto: TransferWalletDto) {
    return this.walletCustomerService.transferMoney(user, dto);
  }

  @Put(':id')
  @Serialize(WalletResponseDto)
  updateWalletById(
    @CurrentUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletCustomerService.updateWalletById(id, user, dto);
  }

  @Delete(':id')
  deleteWalletById(
    @CurrentUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.walletCustomerService.deleteWalletById(id, user);
  }
}
