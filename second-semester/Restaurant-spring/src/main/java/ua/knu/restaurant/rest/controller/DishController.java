package ua.knu.restaurant.rest.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.knu.restaurant.dto.dish.DishReadDto;
import ua.knu.restaurant.service.DishService;

import java.util.List;

@RestController
@RequestMapping(path = "/dishes")
@AllArgsConstructor
public class DishController {

    private final DishService dishService;

    @GetMapping
    public List<DishReadDto> findAll() {
        return dishService.findAll();
    }
}
