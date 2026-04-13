import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { TransactionCustomerService } from '../../services/customer/transaction.customer.service';
import { CurrentUser } from '../../../common/decorators/curent.user.decorator';
import { UserDto } from '../../../auth/dtos/dto';
import {
  CreateTransactionDto,
  GetListTransactionDto,
  TransactionResponseDto,
} from '../../dtos/dto';
import { Serialize } from '../../../common/interceptors/serialize.interceptor';

@Controller(`${PrefixType.CUSTOMER}/transactions`)
@ApiTags('Customer transaction')
export class TransactionCustomerController {
  constructor(
    private readonly transactionCustomerService: TransactionCustomerService,
  ) {}

  @Get()
  @Serialize(TransactionResponseDto)
  getListTransaction(
    @CurrentUser() user: UserDto,
    @Query() query: GetListTransactionDto,
  ) {
    return this.transactionCustomerService.getListTransactionByUser(
      user,
      query,
    );
  }

  @Get('history')
  @Serialize(TransactionResponseDto)
  getTransactionHistory(
    @CurrentUser() user: UserDto,
    @Query() query: GetListTransactionDto,
  ) {
    return this.transactionCustomerService.getTransactionHistory(user, query);
  }

  @Get(':id')
  @Serialize(TransactionResponseDto)
  getTransactionById(
    @CurrentUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionCustomerService.getTransactionById(id, user);
  }

  @Get('information')
  @Serialize(TransactionResponseDto)
  sumAmountTransactionByUserInMonth(@CurrentUser() user: UserDto) {
    return this.transactionCustomerService.sumAmountTransactionByUserInMonth(
      user,
    );
  }

  @Get('summary')
  @Serialize(TransactionResponseDto)
  summaryTransactionByUserInTime(@CurrentUser() user: UserDto) {
    return this.transactionCustomerService.summaryTransactionByUserInTime(user);
  }

  @Post()
  @Serialize(TransactionResponseDto)
  createTransaction(
    @CurrentUser() user: UserDto,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionCustomerService.createTransaction(user, dto);
  }

  @Put(':id')
  @Serialize(TransactionResponseDto)
  updateTransactionById(
    @CurrentUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionCustomerService.updateTransactionById(id, user, dto);
  }

  @Delete(':id')
  deleteTransactionById(
    @CurrentUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionCustomerService.deleteTransactionById(id, user);
  }
}
