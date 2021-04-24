import {DishReadWriteDto} from "../dish/dishReadWriteDto";

export interface OrderReadDto {
    dishes: DishReadWriteDto[],
    totalSum: number,
    status: string
}
