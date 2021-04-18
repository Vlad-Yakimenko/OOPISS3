package ua.knu.restaurant.service.mapper;

import org.mapstruct.Mapper;
import ua.knu.restaurant.dto.order.OrderReadDto;
import ua.knu.restaurant.dto.order.OrderWriteDto;
import ua.knu.restaurant.persistence.domain.Order;

@Mapper(componentModel = "spring", config = CommonMapper.class)
public interface OrderMapper extends CommonMapper<OrderReadDto, OrderWriteDto, Order> {
}
