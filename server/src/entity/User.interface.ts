import { Bill } from "./Bill.interface";
import { Tariff } from "./Tariff.interface";
import { 
  CountryEnum, RoleEnum 
} from "./enum";

export interface User {
  id: number;
  username: string;
  password: string;
  isConnected: boolean;
  country: CountryEnum;
  role: RoleEnum;
  billId: number;
}

export interface UserWithRelations {
  id: number;
  username: string;
  password: string;
  isConnected: boolean;
  country: CountryEnum;
  role: RoleEnum;
  bill: Bill;
  tariffs: Tariff[];
}
