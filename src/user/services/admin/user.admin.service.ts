import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UserRepository } from '../../repositories/user.repository';
import { GetListUserDto } from '../../dtos/dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserAdminService {
  constructor(private readonly userRepository: UserRepository) {}

  async getListUser(params: GetListUserDto) {
    const { name, status, limit, page } = params;

    const query = this.userRepository.createQueryBuilder('user');

    if (name) {
      query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    return paginate<User>(query, {
      page,
      limit,
    });
  }

  async getUserById(id: number) {
    const userFound = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .loadRelationCountAndMap('user.categoryCount', 'user.categories')
      .loadRelationCountAndMap('user.transactionCount', 'user.transactions')
      .getOne();

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    return userFound;
  }

  @Transactional()
  async deleteUserById(id: number) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.userRepository.softDelete(userFound.id);
    } catch (error) {
      throw new InternalServerErrorException('User delete failed');
    }
  }

  @Transactional()
  async blockUserById(id: number, isBlock: boolean) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.userRepository.update(userFound.id, { isBlock });
    } catch (error) {
      throw new InternalServerErrorException('User block failed');
    }
  }
}
