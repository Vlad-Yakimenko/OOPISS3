package ua.knu.restaurant.rest.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.knu.restaurant.dto.dish.DishReadDto;
import ua.knu.restaurant.service.DishService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(path = "/dishes")
@AllArgsConstructor
@CrossOrigin("http://localhost:4200")
public class DishController {

    private final DishService dishService;

    @GetMapping
    public List<DishReadDto> findAll() {
        return dishService.findAll();
    }
}
