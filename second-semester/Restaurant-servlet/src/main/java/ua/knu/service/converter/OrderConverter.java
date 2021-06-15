package ua.knu.service.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.val;
import ua.knu.persistence.model.Order;

public class OrderConverter extends AbstractConverter<Order> {
    @Override
    public Order toEntity(String json) throws JsonProcessingException {
        val order = objectMapper.readValue(json, Order.class);
        return order;
    }
}
