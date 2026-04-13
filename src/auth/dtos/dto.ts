import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Tên đăng nhập của user',
    required: true,
  })
  @IsNotEmpty()
  userName: string;
  @IsNotEmpty()
  @ApiProperty({
    example: 'john_doe',
    description: 'Tên đăng nhập của user',
    required: true,
  })
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

export class UserProfileDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  userName: string;

  @Expose()
  isAdmin: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  categoryCount: number;

  @Expose()
  transactionCount: number;
}
