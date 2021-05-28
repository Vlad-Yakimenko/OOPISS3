package ua.knu.restaurant.dto.order;

import lombok.Value;

import java.util.List;

@Value
public class OrderWriteDto {
    String username;
    List<OrderDishDto> dishes;
    String status;
}
