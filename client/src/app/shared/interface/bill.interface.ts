import { Currency } from '../enum';
import { User } from './user.interface';

export interface Bill {
  id?: number;
  userId?: number;
  user?: User;
  balance: number;
  currency: Currency;
}
