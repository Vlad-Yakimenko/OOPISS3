package ua.knu.persistence.repository;

import lombok.RequiredArgsConstructor;
import lombok.val;
import ua.knu.persistence.database.ConnectionPool;
import ua.knu.persistence.model.Dish;

import java.sql.SQLException;
import java.util.ArrayList;

@RequiredArgsConstructor
public class DishRepositoryImpl implements DishRepository {

    private static final String SELECT_FROM_DISHES = "SELECT * FROM dishes;";

    @Override
    public Iterable<Dish> findAll() {
        val connection = ConnectionPool.INSTANCE.getConnection();

        try (val statement = connection.createStatement()) {

            val dishes = new ArrayList<Dish>();
            val resultSet = statement.executeQuery(SELECT_FROM_DISHES);

            while (resultSet.next()) {
                dishes.add(new Dish()
                        .setId(resultSet.getInt("dish_id"))
                        .setName(resultSet.getString("name"))
                        .setDescription(resultSet.getString("description"))
                        .setPrice(resultSet.getDouble("price")));
            }

            return dishes;

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            ConnectionPool.INSTANCE.releaseConnection(connection);
        }

        return null;
    }
}
