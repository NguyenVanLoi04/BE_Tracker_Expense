import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UserCustomerService {
  constructor(private readonly userRepository: UserRepository) {}

  async getList() {}
}
