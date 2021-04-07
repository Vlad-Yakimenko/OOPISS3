import { CurrencyEnum } from "./enum";
import { User } from "./User.interface";

export interface Bill {
  id: number;
  userId: number;
  balance: number;
  currency: CurrencyEnum;
}

export interface BillWithRelations {
  id: number;
  user: User;
  balance: number;
  currency: CurrencyEnum;
}
