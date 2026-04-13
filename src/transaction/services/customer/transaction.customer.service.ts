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
import { GetListTransactionDto } from '../../dtos/dto';
import { CategoryRepository } from '../../../category/repositories/category.repository';
import { TransactionType } from '../../enums/enum';
import { paginate } from 'nestjs-typeorm-paginate';
import dayjs from 'dayjs';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TransactionCustomerService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly userRepo: UserRepository,
    private readonly categoryRepo: CategoryRepository,
  ) {}

  private createBaseTransactionQuery(
    userId: number,
    query: GetListTransactionDto,
  ) {
    const { startDate, endDate, type, search } = query;

    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.deletedAt IS NULL');

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'transaction.transactionDate BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (search) {
      queryBuilder.andWhere(
        '(transaction.note ILIKE :search OR category.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('transaction.transactionDate', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC');

    return queryBuilder;
  }

  async getListTransactionByUser(user: UserDto, query: GetListTransactionDto) {
    const { limit = 10, page = 1 } = query;
    const queryBuilder = this.createBaseTransactionQuery(user.userId, query);

    const result = await paginate(queryBuilder, { page, limit });

    return {
      data: result.items,
      meta: result.meta,
    };
  }

  async getTransactionHistory(user: UserDto, query: GetListTransactionDto) {
    const { limit = 20, page = 1 } = query;
    const queryBuilder = this.createBaseTransactionQuery(user.userId, query);

    // History lấy thêm thông tin wallet (đã ẩn wallet nên có thể skip join này nếu muốn hoàn toàn tách biệt)
    // Tuy nhiên để không lỗi query nếu column vẫn còn, ta để nguyên hoặc bỏ join nếu muốn
    // queryBuilder.leftJoinAndSelect('transaction.wallet', 'wallet');

    const result = await paginate(queryBuilder, { page, limit });

    return {
      data: result.items,
      meta: result.meta,
    };
  }

  async getTransactionById(id: number, user: UserDto) {
    const { userId } = user;

    const transactionFound = await this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.id = :id', { id })
      .andWhere('transaction.deletedAt IS NULL')
      .getOne();

    if (!transactionFound) {
      throw new NotFoundException('Transaction not found');
    }

    return transactionFound;
  }

  @Transactional()
  async createTransaction(user: UserDto, dto: CreateTransactionDto) {
    const { userId } = user;
    const { amount, note, type, categoryId } = dto;
    const numAmount = Number(amount);

    if (type === TransactionType.INCOME && numAmount <= 0) {
      throw new BadRequestException('Income amount must be greater than 0');
    }

    if (type === TransactionType.EXPENSE && numAmount <= 0) {
      throw new BadRequestException('Expense amount must be greater than 0');
    }

    const userFound = await this.userRepo.findOneBy({ id: userId });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const categoryFound = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }

    const newTransaction = this.transactionRepo.create({
      amount: numAmount,
      note,
      type,
      transactionDate: new Date(),
      user: userFound,
      category: categoryFound,
    });

    return this.transactionRepo.save(newTransaction);
  }

  @Transactional()
  async updateTransactionById(
    id: number,
    user: UserDto,
    dto: UpdateTransactionDto | CreateTransactionDto,
  ) {
    const { userId } = user;
    const { amount, note, type, transactionDate, categoryId } =
      dto as CreateTransactionDto;
    const numAmount = Number(amount);

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
      amount: numAmount,
      note,
      type,
      transactionDate,
      category: { id: categoryId },
    });

    return this.transactionRepo.save(updatedTransaction);
  }

  @Transactional()
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
      throw new InternalServerErrorException('Transaction deleted failed');
    }
  }

  async deleteAllTransactionByUser() {}

  async sumAmountTransactionByUserInMonth(user: UserDto) {
    const { userId } = user;
    const now = dayjs();
    const startOfMonth = now.startOf('month').toDate();
    const endOfMonth = now.endOf('month').toDate();

    return this.transactionRepo
      .createQueryBuilder('transaction')
      .select('transaction.type', 'type')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.deletedAt IS NULL')
      .addSelect('SUM(transaction.amount)', 'totalAmount')
      .andWhere('transaction.createdAt BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth,
        endOfMonth,
      })
      .groupBy('transaction.type')
      .getRawMany();
  }

  async sumAmountTransactionByUserInTime() {
    return 0;
  }

  async summaryTransactionByUserInTime(user: UserDto) {
    const now = dayjs();
    const startOfMonth = now.startOf('month').toDate();
    const endOfMonth = now.endOf('month').toDate();

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

    return result.map((item) => ({
      categoryName: item.categoryName,
      totalAmount: Number(item.totalAmount) || 0,
    }));
  }
}
