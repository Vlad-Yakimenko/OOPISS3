import { Bill } from "./bill.entity";
import { Tariff } from "./tariff.entity";
import { 
  Country, Role
} from "./enum";

export interface User {
  id?: number;
  username: string;
  password: string;
  isConnected: boolean | number;
  country: Country;
  role: Role;
  billId?: number;
  bill?: Bill;
  tariffs?: Tariff[];
}
