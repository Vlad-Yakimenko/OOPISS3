import {
  Entity, Column,
  PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'calling'
})
export class CallingEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: false
  })
  cost: number;

  @ManyToOne(() => UserEntity, user => user.incomingCallings)
  receiver: UserEntity;

  @ManyToOne(() => UserEntity, user => user.outgoingCallings)
  sender: UserEntity;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false
  })
  duration: number; // in seconds
}
