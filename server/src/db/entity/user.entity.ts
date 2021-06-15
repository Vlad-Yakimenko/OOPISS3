import {
  Entity, Column,
  PrimaryGeneratedColumn, JoinColumn,
  OneToOne, OneToMany, ManyToMany, JoinTable,
} from 'typeorm';

import { BillEntity } from './bill.entity';
import { CallingEntity } from './calling.entity';
import { Country, Role } from './enum';
import { TariffEntity } from './tariff.entity';

@Entity({
  name: 'user'
})
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  password: string;

  @Column({
    type: 'bool',
    default: false,
    nullable: false
  })
  isConnected: boolean;

  @Column({
    type: 'enum',
    enum: Country,
    default: Country.Ukraine,
    nullable: false
  })
  country: Country;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Abonent,
    nullable: false
  })
  role: Role;

  @OneToOne(() => BillEntity, bill => bill.user, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true
  })
  @JoinColumn()
  bill: BillEntity;

  @OneToMany(() => CallingEntity, calling => calling.receiver, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true
  })
  incomingCallings: CallingEntity[];

  @OneToMany(() => CallingEntity, calling => calling.sender, {
    onDelete: 'CASCADE',
    cascade: true, 
    eager: true
  })
  outgoingCallings: CallingEntity[];

  @ManyToMany(() => TariffEntity, tariff => tariff.users, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true
  })
  @JoinTable({
    name: 'user_tariff',
  })
  tariffs: TariffEntity[];
}
