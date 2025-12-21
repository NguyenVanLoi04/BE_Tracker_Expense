import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import { UserAdminService } from '../../services/admin/user.admin.service';

@Controller(`${PrefixType.ADMIN}/users`)
@ApiTags('User Admin')
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return;
  }

  @Get()
  getListUser() {
    return;
  }
}
