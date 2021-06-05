import { Role } from "@app/entity/enum";

export interface JwtPayload {
  userId: number;
  role: Role;
  iat?: number;
}