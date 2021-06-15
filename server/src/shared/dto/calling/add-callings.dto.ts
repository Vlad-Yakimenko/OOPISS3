import { Calling } from "@app/shared/interface";

export interface AddCallingsDto {
  userId: number;
  callings: Array<Calling>;
}