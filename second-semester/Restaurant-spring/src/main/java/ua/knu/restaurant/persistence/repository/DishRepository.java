package ua.knu.restaurant.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.knu.restaurant.persistence.domain.Dish;

public interface DishRepository extends JpaRepository<Dish, Integer> {
}
