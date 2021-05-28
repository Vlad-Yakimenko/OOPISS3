package ua.knu.restaurant.service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ua.knu.restaurant.persistence.domain.Dish;
import ua.knu.restaurant.persistence.repository.DishRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class DishService {

    private DishRepository dishRepository;

    public List<Dish> findAll() {
        return dishRepository.findAll();
    }
}
