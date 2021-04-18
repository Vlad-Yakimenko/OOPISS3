package ua.knu.restaurant.dto.order;

import lombok.Value;
import ua.knu.restaurant.dto.dish.DishReadDto;

import java.util.List;

@Value
public class OrderReadDto {
    List<DishReadDto> dishes;
    Integer totalSum;
    String status;
}
