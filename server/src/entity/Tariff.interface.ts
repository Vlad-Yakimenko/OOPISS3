import { Country } from "./enum";
import { User } from "./user.interface";

export interface Tariff {
  id?: number;
  naming: string;
  discount: number;
  country: Country;
  users?: User[];
}