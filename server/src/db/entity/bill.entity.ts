import {
  Entity, Column,
  PrimaryGeneratedColumn, OneToOne,
} from 'typeorm';

import { Currency } from './enum';
import { UserEntity } from './user.entity';

@Entity({
  name: 'bill'
})
export class BillEntity {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id: number;

  @Column({
    type: 'float',
    precision: 10,
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

  @OneToOne(() => UserEntity, user => user.bill)
  user: UserEntity;
}
