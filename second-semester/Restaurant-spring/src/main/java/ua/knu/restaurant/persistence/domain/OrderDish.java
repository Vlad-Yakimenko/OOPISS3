package ua.knu.restaurant.persistence.domain;

import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "orders_dishes")
@Data
@Accessors(chain = true)
public class OrderDish implements Serializable {

    private static final long serialVersionUID = 8188099813187218743L;

    @EmbeddedId
    private OrderDishPK id;

    @Column(nullable = false)
    private Integer quantity;

    @Transient
    public Dish getDish() {
        return id.getDish();
    }
}
