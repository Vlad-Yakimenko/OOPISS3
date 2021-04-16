import { Country } from "../enum";

export interface Tariff {
  id: number;
  naming: string;
  discount: number;
  country: Country;
}
