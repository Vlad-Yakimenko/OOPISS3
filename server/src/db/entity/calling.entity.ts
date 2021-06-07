import { 
  Entity, Column, 
  PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Calling {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'float',
    precision: 6,
    scale: 2,
    unsigned: true,
    nullable: false
  })
  cost: number;

  @ManyToOne(() => User, user => user.incomingCallings)
  receiver: User;

  @ManyToOne(() => User, user => user.outgoingCallings)
  sender: User;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false
  })
  duration: number; // in seconds
}
