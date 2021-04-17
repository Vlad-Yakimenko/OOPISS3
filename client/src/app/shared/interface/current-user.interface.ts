import { Role } from "../enum";

export interface CurrentUser {
  userId: number;
  role: Role;
  token: string;
  balance?: number;
}