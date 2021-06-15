import { 
  Country, Currency 
} from "@app/db/entity/enum";

export interface SignUpDto {
  phone: string;
  password: string;
  country: Country;
  currency: Currency;
}