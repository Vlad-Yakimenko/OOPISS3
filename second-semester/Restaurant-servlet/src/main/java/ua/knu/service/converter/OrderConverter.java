package ua.knu.service.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.SneakyThrows;
import lombok.val;
import org.json.JSONArray;
import ua.knu.persistence.model.Order;
import ua.knu.persistence.model.OrderDish;

import java.util.ArrayList;
import java.util.List;

public class OrderConverter extends AbstractConverter<Order> {
    @Override
    public Order toEntity(String json) throws JsonProcessingException {
        val order = objectMapper.readValue(json, Order.class);
        return order;
    }

    @SneakyThrows
    public List<OrderDish> toOrderDishes(String json) {
        val orderDishes = new ArrayList<OrderDish>();
        val jsonArray = new JSONArray(json);

        jsonArray.forEach(orderDishString -> {
            try {
                orderDishes.add(objectMapper.readValue(orderDishString.toString(), OrderDish.class));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        });

        return orderDishes;
    }
}
