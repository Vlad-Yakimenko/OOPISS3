package ua.knu.restaurant.dto.order;

import lombok.Value;
import ua.knu.restaurant.dto.dish.DishWriteDto;

@Value
public class OrderDishWriteDto {
    Integer quantity;
    DishWriteDto dish;
}
