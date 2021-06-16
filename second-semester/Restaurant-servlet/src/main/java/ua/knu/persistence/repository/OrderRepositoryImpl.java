package ua.knu.persistence.repository;

import lombok.SneakyThrows;
import lombok.val;
import ua.knu.persistence.database.ConnectionPool;
import ua.knu.persistence.model.Dish;
import ua.knu.persistence.model.Order;
import ua.knu.service.converter.AbstractConverter;
import ua.knu.service.converter.OrderConverter;
import ua.knu.util.Constants;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class OrderRepositoryImpl implements OrderRepository {

    private static final String SAVE_ORDER = "INSERT INTO orders (status, order_dishes, username) VALUES (?, ?, ?)";
    private static final String FIND_BY_USERNAME = "SELECT * FROM orders " +
            "WHERE username = ?";
    private static final String FIND_BY_USERNAME_AND_ORDER_DISHES = "SELECT * FROM orders " +
            "WHERE username = ? AND order_dishes = ? " +
            "ORDER BY order_id DESC";

    private final OrderConverter orderConverter;
    private final DishRepository dishRepository;

    public OrderRepositoryImpl() {
        this.orderConverter = new OrderConverter();
        this.dishRepository = new DishRepositoryImpl();
    }

    @Override
    @SneakyThrows
    @SuppressWarnings("unchecked")
    public <S extends Order> S save(S entity) {
        val connection = ConnectionPool.INSTANCE.getConnection();

        try (val preparedStatementSave = connection.prepareStatement(SAVE_ORDER);
             val preparedStatementFind = connection.prepareStatement(FIND_BY_USERNAME_AND_ORDER_DISHES)) {

            val objectMapper = AbstractConverter.getObjectMapper();
            val orderDishesString = objectMapper.writeValueAsString(entity.getDishes());

            preparedStatementSave.setString(1, entity.getStatus().name());
            preparedStatementSave.setString(2, orderDishesString);
            preparedStatementSave.setString(3, entity.getUsername());
            preparedStatementSave.execute();

            preparedStatementFind.setString(1, entity.getUsername());
            preparedStatementFind.setString(2, orderDishesString);
            preparedStatementFind.execute();
            val resultSet = preparedStatementFind.getResultSet();
            resultSet.next();

            return (S) entity.setId(resultSet.getInt(Constants.ORDER_ID));

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        } finally {
            ConnectionPool.INSTANCE.releaseConnection(connection);
        }
    }

    @Override
    public List<Order> findByUsername(String username) {
        val connection = ConnectionPool.INSTANCE.getConnection();

        try (val preparedStatement = connection.prepareStatement(FIND_BY_USERNAME)) {

            preparedStatement.setString(1, username);
            preparedStatement.execute();
            val resultSet = preparedStatement.getResultSet();
            val orders = new ArrayList<Order>();
            val dishes = dishRepository.findAll()
                    .stream()
                    .collect(Collectors.toMap(Dish::getName, dish -> dish));

            while (resultSet.next()) {
                val orderDishes = orderConverter.toOrderDishes(resultSet.getString("order_dishes"));
                val totalSum = orderDishes.stream()
                        .map(orderDish -> orderDish.getQuantity() * dishes.get(orderDish.getDishName()).getPrice())
                        .reduce(0.0, Double::sum);

                orders.add(new Order().setId(resultSet.getInt(Constants.ORDER_ID))
                        .setStatus(Order.ORDER_STATUS.valueOf(resultSet.getString(Constants.STATUS)))
                        .setUsername(resultSet.getString(Constants.USERNAME))
                        .setDishes(orderDishes)
                        .setTotalSum(totalSum));
            }

            return orders;

        } catch (SQLException e) {
            e.printStackTrace();
            return Collections.emptyList();
        } finally {
            ConnectionPool.INSTANCE.releaseConnection(connection);
        }
    }
}
