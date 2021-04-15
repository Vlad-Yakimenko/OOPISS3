import { 
  Country, Role, Currency 
} from "@app/entity/enum";

export interface SignUpDto {
  username: string;
  password: string;
  country: Country;
  currency: Currency;
}