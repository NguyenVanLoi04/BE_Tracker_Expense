import { User } from './../../../user/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { UserDto } from '../../../auth/dtos/dto';
import { CreateTransactionDto, UpdateTransactionDto } from '../../dtos/dto';
import { UserRepository } from '../../../user/repositories/user.repository';
import { CategoryRepository } from '../../../category/repositories/category.repository';
import { EXPENSE_TYPE } from '../../../user/enums/enum';
import { TransactionType } from '../../enums/enum';
import dayjs from 'dayjs';

@Injectable()
export class TransactionCustomerService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly userRepo: UserRepository,
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async getListTransactionByUser(user: UserDto) {
    const { userId } = user;

    const getListTransactionByUser = await this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.deletedAt IS NULL')
      .getMany();

    return getListTransactionByUser;
  }

  async getTransactionById(id: number, user: UserDto) {
    const { userId } = user;

    const transactionFound = await this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.id = :id', { id })
      .andWhere('transaction.deletedAt IS NULL')
      .getOne();

    if (!transactionFound) {
      throw new NotFoundException('Transaction not found');
    }

    return transactionFound;
  }

  async createTransaction(user: UserDto, dto: CreateTransactionDto) {
    const { userId } = user;
    const { amount, note, type, transactionDate, categoryId } = dto;

    if (type === TransactionType.INCOME && amount <= 0) {
      throw new BadRequestException('Income amount must be greater than 0');
    }

    if (type === TransactionType.EXPENSE && amount <= 0) {
      throw new BadRequestException('Expense amount must be greater than 0');
    }

    const userFound = await this.userRepo.findOneBy({ id: userId });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    const categoryFound = await this.categoryRepo.findOne({
      where: {
        id: categoryId,
        user: { id: userId },
      },
    });

    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }

    const newTransaction = this.transactionRepo.create({
      amount,
      note,
      type,
      transactionDate,
      user: userFound,
      category: categoryFound,
    });

    return this.transactionRepo.save(newTransaction);
  }

  async updateTransactionById(
    id: number,
    user: UserDto,
    dto: CreateTransactionDto,
  ) {
    const { userId } = user;
    const { amount, note, type, transactionDate, categoryId } = dto;

    const transactionFound = await this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.id = :id', { id })
      .andWhere('transaction.deletedAt IS NULL')
      .getOne();

    if (!transactionFound) {
      throw new NotFoundException('Transaction not found');
    }

    const updatedTransaction = this.transactionRepo.merge(transactionFound, {
      amount,
      note,
      type,
      transactionDate,
      category: { id: categoryId },
    });

    return this.transactionRepo.save(updatedTransaction);
  }

  async deleteTransactionById(id: number, user: UserDto) {
    const { userId } = user;

    const transactionFound = await this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.id = :id', { id })
      .getOne();

    if (!transactionFound) {
      throw new NotFoundException('Transaction not found');
    }

    const result = await this.transactionRepo.softDelete(transactionFound.id);

    if (!result.affected) {
      throw new InternalServerErrorException('Transaction deteled failed');
    }
  }

  async deleteAllTransactionByUser() {}

  async sumAmountTransactionByUserInMonth(user: UserDto) {
    const { userId } = user;
    const now = dayjs();
    const startOfMonth = now.startOf('month');
    const endOfMonth = now.endOf('month');

    const transaction = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('transaction.type', 'type')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.deletedAt IS NULL')
      .addSelect('SUM(transaction.amount)', 'totalAmount')
      .addSelect('transaction.type', 'type')
      .andWhere('transaction.createdAt BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth,
        endOfMonth,
      })
      .groupBy('transaction.type')
      .getRawMany();

    return transaction;
  }
  async sumAmountTransactionByUserInTime() {
    return 0;
  }

  async summaryTransactionByUserInTime(user: UserDto) {
    const now = dayjs();
    const startOfMonth = now.startOf('month');
    const endOfMonth = now.endOf('month');

    const { userId } = user;

    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoin('transaction.category', 'category')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.deletedAt IS NULL')
      .andWhere('transaction.type = :type', { type: TransactionType.EXPENSE })
      .select('category.name', 'categoryName')
      .addSelect('SUM(transaction.amount)', 'totalAmount')
      .andWhere('transaction.createdAt BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth,
        endOfMonth,
      })
      .groupBy('category.name')
      .getRawMany();

    const summary = result.map((item) => {
      return {
        categoryName: item.categoryName,
        totalAmount: item.totalAmount,
      };
    });

    return summary;
  }
}
