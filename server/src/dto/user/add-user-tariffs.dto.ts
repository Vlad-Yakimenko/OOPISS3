import { Tariff } from "@app/entity";

export interface AddUserTariffsDto {
  userId: number;
  tariffs: Tariff[];
}