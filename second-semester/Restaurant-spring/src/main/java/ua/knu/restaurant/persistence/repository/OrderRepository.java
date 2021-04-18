package ua.knu.restaurant.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.knu.restaurant.persistence.domain.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findAllByUserId(Integer userId);
}
