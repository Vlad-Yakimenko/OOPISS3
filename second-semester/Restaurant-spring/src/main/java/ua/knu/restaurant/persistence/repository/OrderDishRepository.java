package ua.knu.restaurant.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.knu.restaurant.persistence.domain.OrderDish;
import ua.knu.restaurant.persistence.domain.OrderDishPK;

public interface OrderDishRepository extends JpaRepository<OrderDish, OrderDishPK> {
}
