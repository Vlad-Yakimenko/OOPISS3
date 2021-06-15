import { Country, Role } from "@app/db/entity/enum";
import { Bill } from "./bill";
import { Tariff } from "./tariff";

export interface User {
  id?: number;
  phone: string;
  password: string;
  isConnected: boolean;
  country: Country;
  role: Role;
  billId?: number;
  bill?: Bill;
  tariffs?: Tariff[];
}