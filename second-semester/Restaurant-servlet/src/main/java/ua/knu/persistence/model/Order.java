package ua.knu.persistence.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
public class Order {

    public enum ORDER_STATUS {
        PENDING, APPROVED, DECLINED
    }

    private Integer id;
    private ORDER_STATUS status;
    private List<OrderDish> dishes;
    private String username;
}
