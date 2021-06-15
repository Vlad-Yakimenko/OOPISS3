package ua.knu.persistence.database;

import lombok.SneakyThrows;

import java.sql.*;
import java.util.Collections;
import java.util.List;

public class JdbcDatabaseManager implements DatabaseManager {

    @SneakyThrows
    public JdbcDatabaseManager() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void execute(String sql) {
        try (Connection connection = getConnection();
             Statement statement = connection.createStatement()) {

            statement.execute(sql);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public <T> T getSingleResult(String sql, Class<T> type) {
        try (Connection connection = getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.getResultSet()) {

//            statement.se
            statement.execute(sql);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public <T> List<T> getResultList(String sql, Class<T> type) {
        return Collections.emptyList();
    }

    @Override
    public Connection getConnection() {
        return ConnectionFactory.getConnection();
    }
}
