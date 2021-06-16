package ua.knu.persistence.model;

import com.fasterxml.jackson.annotation.JsonInclude;
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
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double totalSum;
}
