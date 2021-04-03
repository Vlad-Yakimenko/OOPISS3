package ua.knu.restaurant.service.mapper;

import org.mapstruct.Mapper;
import ua.knu.restaurant.dto.dish.DishReadDto;
import ua.knu.restaurant.dto.dish.DishWriteDto;
import ua.knu.restaurant.persistence.domain.Dish;

@Mapper(componentModel = "spring", config = CommonMapper.class)
public interface DishMapper extends CommonMapper<DishReadDto, DishWriteDto, Dish> {
}
