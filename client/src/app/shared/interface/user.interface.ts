import { 
  Country, Role 
} from '../enum';
import { Bill } from './bill.interface';
import { Tariff } from './tariff.interface';

export interface User {
  id?: number;
  username: string;
  isConnected: boolean;
  country: Country;
  role: Role;
  tariffs: Tariff[];
  bill: Bill;
}
