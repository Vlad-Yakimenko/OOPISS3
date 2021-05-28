package ua.knu.restaurant.service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ua.knu.restaurant.dto.order.OrderReadDto;
import ua.knu.restaurant.dto.order.OrderWriteDto;
import ua.knu.restaurant.persistence.repository.OrderRepository;
import ua.knu.restaurant.service.converter.OrderConverter;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class OrderService {

    private OrderRepository orderRepository;
    private OrderConverter orderConverter;

    public void checkout(OrderWriteDto orderWriteDto) {
        orderRepository.save(orderConverter.dtoToEntity(orderWriteDto));
    }

    public List<OrderReadDto> getAll() {
        return orderRepository.findAll().stream()
                .map(orderConverter::entityToDto)
                .collect(Collectors.toList());
    }

    public List<OrderReadDto> getAllByUserId(Integer userId) {
        return orderRepository.findAllByUserId(userId).stream()
                .map(orderConverter::entityToDto)
                .collect(Collectors.toList());
    }
}
