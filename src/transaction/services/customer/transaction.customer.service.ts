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
import { WalletRepository } from '../../../wallet/repositories/wallet.repository';
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
    private readonly walletRepo: WalletRepository,
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

    // History lấy thêm thông tin wallet
    queryBuilder.leftJoinAndSelect('transaction.wallet', 'wallet');

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
      .leftJoinAndSelect('transaction.wallet', 'wallet')
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
    const { amount, note, type, transactionDate, categoryId, walletId } = dto;
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
      where: { id: categoryId, user: { id: userId } },
    });
    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }

    const walletFound = await this.walletRepo.findOne({
      where: { id: walletId, user: { id: userId } },
    });
    if (!walletFound) {
      throw new NotFoundException('Wallet not found');
    }

    const currentBalance = Number(walletFound.balance);

    if (type === TransactionType.EXPENSE) {
      if (currentBalance < numAmount) {
        throw new BadRequestException('Insufficient balance in wallet');
      }
      walletFound.balance = currentBalance - numAmount;
    } else {
      walletFound.balance = currentBalance + numAmount;
    }

    await this.walletRepo.save(walletFound);

    const newTransaction = this.transactionRepo.create({
      amount: numAmount,
      note,
      type,
      transactionDate,
      user: userFound,
      category: categoryFound,
      wallet: walletFound,
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
    const { amount, note, type, transactionDate, categoryId, walletId } =
      dto as CreateTransactionDto;
    const numAmount = Number(amount);

    const transactionFound = await this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.id = :id', { id })
      .andWhere('transaction.deletedAt IS NULL')
      .getOne();

    if (!transactionFound) {
      throw new NotFoundException('Transaction not found');
    }

    const oldWallet = transactionFound.wallet;
    const oldAmount = Number(transactionFound.amount);
    const oldType = transactionFound.type;

    // Phục hồi lại số dư ví trước khi cập nhật transaction mới
    if (oldWallet) {
      const balance = Number(oldWallet.balance);
      if (oldType === TransactionType.EXPENSE) {
        oldWallet.balance = balance + oldAmount;
      } else {
        oldWallet.balance = balance - oldAmount;
      }
      await this.walletRepo.save(oldWallet);
    }

    let newWallet = await this.walletRepo.findOne({
      where: { id: walletId, user: { id: userId } },
    });

    if (!newWallet) {
      throw new NotFoundException('New Wallet not found');
    }

    // Nếu ví mới trùng với ví cũ, ta dùng reference của ví cũ để có dòng balance mới nhất đã được logic bên trên phục hồi.
    if (oldWallet && oldWallet.id === newWallet.id) {
      newWallet = oldWallet;
    }

    const currentBalance = Number(newWallet.balance);

    // Tính toán lại theo giao dịch cập nhật mới
    if (type === TransactionType.EXPENSE) {
      if (currentBalance < numAmount) {
        throw new BadRequestException('Insufficient balance in new wallet');
      }
      newWallet.balance = currentBalance - numAmount;
    } else {
      newWallet.balance = currentBalance + numAmount;
    }

    await this.walletRepo.save(newWallet);

    const updatedTransaction = this.transactionRepo.merge(transactionFound, {
      amount: numAmount,
      note,
      type,
      transactionDate,
      category: { id: categoryId },
      wallet: newWallet,
    });

    return this.transactionRepo.save(updatedTransaction);
  }

  @Transactional()
  async deleteTransactionById(id: number, user: UserDto) {
    const { userId } = user;

    const transactionFound = await this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.id = :id', { id })
      .getOne();

    if (!transactionFound) {
      throw new NotFoundException('Transaction not found');
    }

    // Phục hồi lại tiền vào ví trước khi xoá luôn giao dịch
    const wallet = transactionFound.wallet;
    if (wallet) {
      const oldAmount = Number(transactionFound.amount);
      const balance = Number(wallet.balance);
      if (transactionFound.type === TransactionType.EXPENSE) {
        wallet.balance = balance + oldAmount;
      } else {
        wallet.balance = balance - oldAmount;
      }
      await this.walletRepo.save(wallet);
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
      .addSelect('transaction.type', 'type')
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
