package ua.knu.restaurant.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ua.knu.restaurant.dto.dish.DishReadDto;
import ua.knu.restaurant.persistence.repository.DishRepository;
import ua.knu.restaurant.service.mapper.DishMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class DishService {

    private DishRepository dishRepository;
    private DishMapper dishMapper;

    public List<DishReadDto> findAll() {
        return dishRepository.findAll()
                .stream()
                .map(dishMapper::entityToDto)
                .collect(Collectors.toList());
    }
}
