import { Country } from "@app/db/entity/enum";
import { User } from "./user";

export interface Tariff {
  id?: number;
  naming: string;
  discount: number;
  country: Country;
  users?: User[];
  cost: number;
}