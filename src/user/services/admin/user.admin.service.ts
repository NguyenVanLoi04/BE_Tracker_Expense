import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UserAdminService {
  constructor(private readonly userRepository: UserRepository) {}
}
