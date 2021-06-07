import {
  Entity, Column,
  PrimaryGeneratedColumn, JoinColumn,
  OneToOne, OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import { Bill } from './bill.entity';
import { Calling } from './calling.entity';
import { Country, Role } from './enum';
import { Tariff } from './tariff.entity';

@Entity()
export class User {
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

  @OneToOne(() => Bill, bill => bill.user, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true
  })
  @JoinColumn()
  bill: Bill;

  @OneToMany(() => Calling, calling => calling.receiver, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true
  })
  incomingCallings: Calling[];

  @OneToMany(() => Calling, calling => calling.sender, {
    onDelete: 'CASCADE',
    cascade: true, 
    eager: true
  })
  outgoingCallings: Calling[];

  @ManyToMany(() => Tariff, tariff => tariff.users, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true
  })
  @JoinTable({
    name: 'user_tariff',
  })
  tariffs: Tariff[];
}
