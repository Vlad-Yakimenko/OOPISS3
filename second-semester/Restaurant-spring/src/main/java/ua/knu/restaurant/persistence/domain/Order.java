package ua.knu.restaurant.persistence.domain;

import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Accessors(chain = true)
public class Order implements Serializable {

    private static final long serialVersionUID = 521006555896416971L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "id.order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDish> dishes;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    public enum OrderStatus {
        ACCEPTED, DECLINED, PENDING
    }
}
