package ua.knu.persistence.repository;

import ua.knu.persistence.model.Dish;

import java.util.Collection;
import java.util.List;

public interface DishRepository extends CrudRepository<Dish, Integer> {
    List<Dish> findAllByNameIn(Collection<String> names);
}
