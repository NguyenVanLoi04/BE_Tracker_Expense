import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from '../../category/entities/category.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  userName: string;

  @Column({
    length: 100,
    nullable: false,
    default: '', // 👉 giúp migration không chết
  })
  passWord: string;

  @Column({ default: false })
  isBlock: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  // 1 User có nhiều Transaction
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  // 1 User có thể tạo nhiều category cho riêng mình

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  // 1 User co nhieu Wallet
  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
}
