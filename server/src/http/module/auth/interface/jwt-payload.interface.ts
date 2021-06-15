import { Role } from '@app/db/entity/enum';

export interface JwtPayload {
  userId: number;
  role: Role;
  iat?: number;
}