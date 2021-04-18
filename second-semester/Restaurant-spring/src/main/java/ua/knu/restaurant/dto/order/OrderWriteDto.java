package ua.knu.restaurant.dto.order;

import lombok.Value;

import java.util.List;

@Value
public class OrderWriteDto {
    Integer userId;
    String status;
    List<Integer> dishIds;
}
