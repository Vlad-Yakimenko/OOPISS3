import { User } from "./User.interface";

export interface Call {
  id: number;
  receiverId: number;
  senderId: number;
  cost: number;
  duration: number;
}

export interface CallWithRelations {
  id: number;
  receiver: User;
  sender: User;
  cost: number;
  duration: number;
}
