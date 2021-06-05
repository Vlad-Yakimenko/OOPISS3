import { 
  Country, Role, Currency 
} from "@app/entity/enum";

export interface SignUpDto {
  phone: string;
  password: string;
  country: Country;
  currency: Currency;
}