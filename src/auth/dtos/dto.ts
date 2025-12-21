import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'Tên đăng nhập của user' })
  userName: string;
  @ApiProperty({ example: 'john_doe', description: 'Tên đăng nhập của user' })
  passWord: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'username', description: '	TokenName' })
  userName: string;
  @ApiProperty({ example: 'password', description: '	TokenName' })
  passWord: string;
  @ApiProperty({ example: 'john_doe', description: '	TokenName' })
  name: string;
}

export class UserDto {
  userId: number;
  userName: string;
}
