import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { GetListTransactionDto } from '../../dtos/dto';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class TransactionAdminService {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async getListTransaction(dto: GetListTransactionDto) {
    const { search, type, startDate, endDate, page, limit } = dto;

    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.deletedAt IS NULL');

    if (search) {
      query.andWhere('transaction.note LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    if (startDate && endDate) {
      query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    query.orderBy('transaction.transactionDate', 'DESC');
    const result = await paginate(query, { page, limit });

    return result;
  }
}
