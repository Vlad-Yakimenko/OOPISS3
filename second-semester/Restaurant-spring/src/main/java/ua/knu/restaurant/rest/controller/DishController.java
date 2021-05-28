package ua.knu.restaurant.rest.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.knu.restaurant.dto.dish.DishReadDto;
import ua.knu.restaurant.service.DishService;
import ua.knu.restaurant.service.mapper.DishMapper;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping(path = "/dishes")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
@CrossOrigin("http://localhost:4200")
public class DishController {

    private DishMapper dishMapper;
    private DishService dishService;

    @GetMapping
    public List<DishReadDto> findAll() {
        return dishService.findAll().stream()
                .map(dishMapper::entityToDto)
                .collect(Collectors.toList());
    }
}
