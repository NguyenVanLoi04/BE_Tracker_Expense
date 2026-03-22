import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WalletRepository } from '../../repositories/wallet.repository';
import { UserRepository } from '../../../user/repositories/user.repository';
import {
  CreateWalletDto,
  UpdateWalletDto,
  TransferWalletDto,
} from '../../dtos/dto';
import { UserDto } from '../../../auth/dtos/dto';
import { WalletStatus } from '../../enums/wallet.enum';

@Injectable()
export class WalletCustomerService {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async getListWalletByUser(user: UserDto) {
    const { userId } = user;

    const getListWalletByUser = await this.walletRepo
      .createQueryBuilder('wallet')
      .where('wallet.user_id = :userId', { userId })
      .andWhere('wallet.deletedAt IS NULL')
      .getMany();

    return getListWalletByUser;
  }

  async getWalletById(id: number, user: UserDto) {
    const { userId } = user;

    const walletFound = await this.walletRepo
      .createQueryBuilder('wallet')
      .where('wallet.user_id = :userId', { userId })
      .andWhere('wallet.id = :id', { id })
      .andWhere('wallet.deletedAt IS NULL')
      .getOne();

    if (!walletFound) {
      throw new NotFoundException('Wallet not found');
    }

    return walletFound;
  }

  async createWallet(user: UserDto, dto: CreateWalletDto) {
    const { userId } = user;
    const { name, type, balance } = dto;

    const userFound = await this.userRepo.findOneBy({ id: userId });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const newWallet = this.walletRepo.create({
      name,
      type,
      balance,
      user: userFound,
    });

    return this.walletRepo.save(newWallet);
  }

  async updateWalletById(id: number, user: UserDto, dto: UpdateWalletDto) {
    const { userId } = user;
    const { name, type, balance } = dto;

    const walletFound = await this.walletRepo
      .createQueryBuilder('wallet')
      .where('wallet.user_id = :userId', { userId })
      .andWhere('wallet.id = :id', { id })
      .andWhere('wallet.deletedAt IS NULL')
      .getOne();

    if (!walletFound) {
      throw new NotFoundException('Wallet not found');
    }

    const updatedWallet = this.walletRepo.merge(walletFound, {
      name,
      type,
      balance,
    });

    return this.walletRepo.save(updatedWallet);
  }

  async deleteWalletById(id: number, user: UserDto) {
    const { userId } = user;

    const walletFound = await this.walletRepo
      .createQueryBuilder('wallet')
      .where('wallet.user_id = :userId', { userId })
      .andWhere('wallet.id = :id', { id })
      .getOne();

    if (!walletFound) {
      throw new NotFoundException('Wallet not found');
    }

    await this.walletRepo.softDelete(walletFound.id);
  }

  async transferMoney(user: UserDto, dto: TransferWalletDto) {
    const { userId } = user;
    const { fromWalletId, toWalletId, amount } = dto;

    if (fromWalletId === toWalletId) {
      throw new BadRequestException('Cannot transfer money to the same wallet');
    }

    const fromWallet = await this.walletRepo.findOne({
      where: {
        id: fromWalletId,
        user: { id: userId },
        status: WalletStatus.ACTIVE,
      },
    });

    const toWallet = await this.walletRepo.findOne({
      where: {
        id: toWalletId,
        user: { id: userId },
        status: WalletStatus.ACTIVE,
      },
    });

    if (!fromWallet) throw new NotFoundException('Source wallet not found');
    if (!toWallet) throw new NotFoundException('Destination wallet not found');

    if (fromWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance in source wallet');
    }

    fromWallet.balance = Number(fromWallet.balance) - amount;
    toWallet.balance = Number(toWallet.balance) + amount;

    await this.walletRepo.save([fromWallet, toWallet]);

    return { message: 'Transfer successful' };
  }
}
