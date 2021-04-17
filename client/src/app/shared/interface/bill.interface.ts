import { Currency } from '../enum';

export interface Bill {
  id?: number;
  userId: number;
  balance: number;
  currency: Currency;
}
