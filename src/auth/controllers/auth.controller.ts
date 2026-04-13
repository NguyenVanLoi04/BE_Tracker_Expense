import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto, RegisterDto, UserDto, UserProfileDto } from '../dtos/dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/curent.user.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('check')
  checkToken() {
    return {
      valid: true,
      message: 'Token is valid',
    };
  }

  @Public()
  @Post('register')
  @Serialize(UserProfileDto)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('profile')
  @Serialize(UserProfileDto)
  getProfileUser(@CurrentUser() user: UserDto) {
    return this.authService.getUserInfo(user.userId);
  }
}
