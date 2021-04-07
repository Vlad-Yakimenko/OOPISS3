import { Currency } from "./enum";
import { User } from "./user.interface";

export interface Bill {
  id: number;
  userId: number;
  balance: number;
  currency: Currency;
}

export interface BillWithRelations {
  id: number;
  user: User;
  balance: number;
  currency: Currency;
}
