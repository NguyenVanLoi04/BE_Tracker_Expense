import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../repositories/transaction.repository';

@Injectable()
export class TransactionAdminService {
  constructor(private readonly transactionRepo: TransactionRepository) {}
}
