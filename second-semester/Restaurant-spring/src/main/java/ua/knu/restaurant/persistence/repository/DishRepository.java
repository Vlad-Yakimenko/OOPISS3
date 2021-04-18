package ua.knu.restaurant.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.knu.restaurant.persistence.domain.Dish;

import java.util.Collection;
import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Integer> {
    List<Dish> findAllByIdIn(Collection<Integer> ids);
}
