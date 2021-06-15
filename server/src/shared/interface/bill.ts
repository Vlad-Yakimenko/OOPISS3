import { Currency } from "@app/db/entity/enum";
import { User } from "./user";

export interface Bill {
  id?: number;
  userId?: number;
  user?: User;
  balance: number;
  currency: Currency;
}