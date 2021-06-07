import { 
  Entity, Column, 
  PrimaryGeneratedColumn, ManyToMany,
} from 'typeorm';
import { Country } from './enum';
import { User } from './user.entity';

@Entity()
export class Tariff {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false
  })
  naming: string;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    unsigned: true,
    nullable: false
  })
  discount: number;

  @Column({
    type: 'enum',
    enum: Country,
    default: Country.Ukraine,
    nullable: false
  })
  country: Country;

  @Column({
    type: 'float',
    precision: 6,
    scale: 2,
    unsigned: true,
    default: 100.00,
    nullable: false
  })
  cost: number;

  @ManyToMany(() => User, user => user.tariffs)
  users: User[];
}
