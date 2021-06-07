import { 
  Entity, Column, 
  PrimaryGeneratedColumn, OneToOne,
} from 'typeorm';
import { Currency } from './enum';
import { User } from './user.entity';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id: number;

  @Column({
    type: 'float',
    precision: 6,
    scale: 2,
    default: 0,
    unsigned: true,
    nullable: false
  })
  balance: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.UAH,
    nullable: false
  })
  currency: Currency;

  @OneToOne(() => User, user => user.bill)
  user: User;
}
