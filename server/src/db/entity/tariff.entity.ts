import { 
  Entity, Column, 
  PrimaryGeneratedColumn, ManyToMany,
} from 'typeorm';
import { Country } from './enum';
import { UserEntity } from './user.entity';

@Entity({
  name: 'tariff'
})
export class TariffEntity {
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
    precision: 5,
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

  @ManyToMany(() => UserEntity, user => user.tariffs)
  users: UserEntity[];
}
