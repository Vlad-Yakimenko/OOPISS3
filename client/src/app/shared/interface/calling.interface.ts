import { User } from "./user.interface";

export interface Calling {
  id?: number;
  receiverId?: number;
  senderId?: number;
  receiver?: User;
  sender?: User;
  cost: number;
  duration: number;
};