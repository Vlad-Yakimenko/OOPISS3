import { OrderDishDto } from "./orderDishDto";

export interface OrderWriteDto {
  username: string;
  dishes: OrderDishDto[];
  status: string;
}
