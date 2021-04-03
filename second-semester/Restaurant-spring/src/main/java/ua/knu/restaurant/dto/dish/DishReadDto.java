package ua.knu.restaurant.dto.dish;

import lombok.Value;

@Value
public class DishReadDto {
    Integer id;
    String name;
    Double price;
    String description;
}
