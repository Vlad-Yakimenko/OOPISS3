import { Tariff } from "@app/shared/interface";

export interface AddUserTariffsDto {
  userId: number;
  tariffs: Tariff[];
}