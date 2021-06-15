package ua.knu.persistence.model;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class OrderDish {
    private String dishName;
    private Integer quantity;
}
