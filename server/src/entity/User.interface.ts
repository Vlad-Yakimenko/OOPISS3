import { Bill } from "./bill.interface";
import { Tariff } from "./tariff.interface";
import { 
  Country, Role
} from "./enum";

export interface User {
  id: number;
  username: string;
  password: string;
  isConnected: boolean;
  country: Country;
  role: Role;
  billId: number;
}

export interface UserWithRelations {
  id: number;
  username: string;
  password: string;
  isConnected: boolean;
  country: Country;
  role: Role;
  bill: Bill;
  tariffs: Tariff[];
}
