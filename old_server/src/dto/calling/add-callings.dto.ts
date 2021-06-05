import { Calling } from "@app/entity";

export interface AddCallingsDto {
  userId: number;
  callings: Array<Calling>;
}