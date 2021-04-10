import { Country, Role } from "@app/entity/enum";

export interface SignUpDto {
  username: string;
  password: string;
  country: Country;
  role: Role;
}