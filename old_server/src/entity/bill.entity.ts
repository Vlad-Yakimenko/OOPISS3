import { Currency } from "./enum";
import { User } from "./user.entity";

export interface Bill {
  id?: number;
  userId?: number;
  user?: User;
  balance: number;
  currency: Currency;
}
