package ua.knu.restaurant.persistence.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order implements Serializable {

    private static final long serialVersionUID = 521006555896416971L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "pk.order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDish> dishes;

    public enum OrderStatus {
        APPROVED, DECLINED, PENDING
    }
}
