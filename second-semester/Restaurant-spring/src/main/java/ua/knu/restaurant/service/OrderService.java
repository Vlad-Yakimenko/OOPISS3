package ua.knu.restaurant.service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ua.knu.restaurant.dto.order.OrderReadDto;
import ua.knu.restaurant.dto.order.OrderWriteDto;
import ua.knu.restaurant.persistence.domain.Dish;
import ua.knu.restaurant.persistence.domain.Order;
import ua.knu.restaurant.persistence.repository.DishRepository;
import ua.knu.restaurant.persistence.repository.OrderRepository;
import ua.knu.restaurant.persistence.repository.UserRepository;
import ua.knu.restaurant.service.mapper.OrderMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class OrderService {

    private UserRepository userRepository;
    private DishRepository dishRepository;
    private OrderRepository orderRepository;
    private OrderMapper orderMapper;

    public void checkout(OrderWriteDto orderWriteDto) {
        Order order = orderMapper.dtoToEntity(orderWriteDto);

        List<Dish> dishes = dishRepository.findAllByNameIn(
                orderWriteDto.getDishes().stream()
                        .map(dish -> dish.getDish().getName())
                        .collect(Collectors.toList()));

        order.setDishes(dishes);
        orderRepository.save(order);
    }

    public List<OrderReadDto> getAll() {
        return orderRepository.findAll().stream().map(orderMapper::entityToDto).collect(Collectors.toList());
    }

    public List<OrderReadDto> getAllByUserId(Integer userId) {
        return orderRepository.findAllByUserId(userId).stream().map(orderMapper::entityToDto).collect(Collectors.toList());
    }
}
