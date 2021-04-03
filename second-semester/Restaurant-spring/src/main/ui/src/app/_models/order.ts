import {Dish} from "./dish";

export interface Order {
    id: number;
    clientId: number;
    dishes: Dish[];
    totalPrice: number
    status: string;
}
