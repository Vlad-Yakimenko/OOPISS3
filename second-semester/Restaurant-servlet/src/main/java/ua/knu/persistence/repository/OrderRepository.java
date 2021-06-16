package ua.knu.persistence.repository;

import ua.knu.persistence.model.Order;

import java.util.List;

public interface OrderRepository extends CrudRepository<Order, Integer> {
    List<Order> findByUsername(String username);
}
