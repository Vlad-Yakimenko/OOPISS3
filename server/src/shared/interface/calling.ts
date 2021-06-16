import { User } from "./user";

export interface Calling {
  id?: number;
  receiverId?: number;
  senderId?: number;
  receiver?: User;
  sender?: User;
  cost: number;
  duration: number; // in seconds 
}