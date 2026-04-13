import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { WalletStatus, WalletType } from '../enums/wallet.enum';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity({ name: 'wallets' })
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: WalletType,
    default: WalletType.CASH,
  })
  type: WalletType;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({
    type: 'enum',
    enum: WalletStatus,
    default: WalletStatus.ACTIVE,
  })
  status: WalletStatus;

  /*
  // 1 Wallet belongs to 1 User
  @ManyToOne(() => User, (user) => (user as any).wallets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
  */

  /*
  // 1 Wallet has many Transactions
  @OneToMany(() => Transaction, (transaction) => (transaction as any).wallet)
  transactions: Transaction[];
  */
}
