package ua.knu.restaurant.dto.user;

import lombok.Data;
import lombok.experimental.Accessors;
import ua.knu.restaurant.dto.order.OrderReadDto;

import java.util.List;

@Data
@Accessors(chain = true)
public class UserReadDto {
    Integer id;
    String username;
    Integer balance;
    List<OrderReadDto> orders;
}
