import { CountryEnum } from "./enum";
import { User } from "./User.interface";

export interface Tariff {
  id: number;
  naming: string;
  discount: number;
  country: CountryEnum;
}

export interface TariffWithRelations {
  id: number;
  naming: string;
  discount: number;
  country: CountryEnum;
  users: User[];
}
