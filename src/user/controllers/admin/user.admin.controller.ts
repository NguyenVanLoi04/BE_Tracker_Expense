import {
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
import { UserAdminService } from '../../services/admin/user.admin.service';
import { GetListUserDto } from '../../dtos/dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Admin } from '../../../common/decorators/admin.decorator';

@Controller(`${PrefixType.ADMIN}/users`)
@Admin()
@ApiTags('User Admin')
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Public()
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.getUserById(id);
  }

  @Public()
  @Get()
  getListUser(@Query() params: GetListUserDto) {
    return this.userAdminService.getListUser(params);
  }

  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userAdminService.deleteUserById(id);
  }

  @Put(':id/block')
  blockUserById(@Param('id', ParseIntPipe) id: number, isBlock: boolean) {
    return this.userAdminService.blockUserById(id, isBlock);
  }
}
