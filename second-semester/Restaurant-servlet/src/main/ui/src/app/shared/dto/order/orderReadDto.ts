import { DishReadWriteDto } from "../dish/dishReadWriteDto";

export interface OrderReadDto {
  id: number;
  dishes: DishReadWriteDto[];
  totalSum: number;
  status: string;
}
