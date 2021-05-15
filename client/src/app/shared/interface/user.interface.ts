import { 
  Country, Role , Currency,
} from '../enum';
import { Bill } from './bill.interface';
import { Tariff } from './tariff.interface';

export interface User {
  id?: number;
  phone: string;
  password?: string;
  isConnected?: boolean;
  country: Country;
  currency?: Currency;
  role?: Role;
  billId?: number;
  bill?: Bill;
  tariffs?: Tariff[];
}
