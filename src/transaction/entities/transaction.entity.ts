import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { TransactionType } from '../enums/enum';

@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  note?: string;

  @Column({ type: 'date' })
  transactionDate: Date;

  // N Transaction thuộc 1 User
  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // N Transaction thuộc 1 Category
  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
