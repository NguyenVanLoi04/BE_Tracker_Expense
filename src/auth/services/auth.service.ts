import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../user/repositories/user.repository';
import { LoginDto, RegisterDto } from '../dtos/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { userName: dto.userName },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(
      dto.passWord.trim(),
      user.passWord.trim(),
    );

    if (!isMatch) throw new UnauthorizedException('Wrong password');

    const payload = {
      sub: user.id,
      userName: user.userName,
      isAdmin: user.isAdmin,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const { userName, passWord, name } = dto;

    const user = await this.userRepo.findOne({
      where: { userName },
    });

    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(passWord, 10);

    return this.userRepo.save({
      userName,
      passWord: hashedPassword,
      name,
    });
  }

  async getUserInfo(id: number) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin('user.categories', 'category')
      .leftJoin('category.transactions', 'transaction')
      .addSelect('COUNT(category.id)', 'categoryCount')
      .addSelect('COUNT(transaction.id)', 'transactionCount')
      .groupBy('user.id')
      .getRawOne();

    return user;
  }
}
