package ua.knu.restaurant.dto.order;

import lombok.Value;

import java.util.List;

@Value
public class OrderWriteDto {
    String status;
    String username;
    List<OrderDishWriteDto> dishes;
}
