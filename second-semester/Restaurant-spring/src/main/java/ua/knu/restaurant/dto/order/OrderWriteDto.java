package ua.knu.restaurant.dto.order;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
public class OrderWriteDto {
    String username;
    List<OrderDishDto> dishes;
    String status;
}
