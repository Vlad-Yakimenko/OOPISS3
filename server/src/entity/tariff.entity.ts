import { Country } from "./enum";
import { User } from "./user.entity";

export interface Tariff {
  id?: number;
  naming: string;
  discount: number;
  country: Country;
  users?: User[];
  cost: number;
}