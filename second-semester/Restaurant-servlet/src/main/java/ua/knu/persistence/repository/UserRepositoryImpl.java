package ua.knu.persistence.repository;

import lombok.RequiredArgsConstructor;
import lombok.val;
import ua.knu.persistence.database.ConnectionPool;
import ua.knu.persistence.database.DatabaseManager;
import ua.knu.persistence.model.User;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private static final String SAVE_USER = "INSERT INTO users (name, role) VALUES (?, ?);";
    private static final String FIND_ALL_USERS = "SELECT * FROM users;";
    private static final String FIND_BY_USERNAME = "SELECT * FROM users WHERE username = ?;";
    private static final String UPDATE_BALANCE = "UPDATE users SET balance = ? WHERE username = ?;";

    @Override
    public Optional<User> findByUsernameAndPassword(String username, String password) {
        return findAll().stream()
                .filter(user -> user.getUsername().equals(username) && user.getPassword().equals(password))
                .findFirst();
    }

    @Override
    public Optional<User> findByUsername(String username) {
        val connection = ConnectionPool.INSTANCE.getConnection();

        try (val statement = connection.prepareStatement(FIND_BY_USERNAME)) {
            statement.setString(1, username);
            val resultSet = statement.executeQuery();

            if (resultSet.next()) {
                return Optional.of(new User()
                        .setId(resultSet.getLong("user_id"))
                        .setUsername(resultSet.getString("username"))
                        .setPassword(resultSet.getString("password"))
                        .setRole(User.ROLE.valueOf(resultSet.getString("role")))
                        .setBalance(resultSet.getInt("balance")));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            ConnectionPool.INSTANCE.releaseConnection(connection);
        }

        return Optional.empty();
    }

    @Override
    public Collection<User> findAll() {
        val connection = ConnectionPool.INSTANCE.getConnection();

        try (val statement = connection.createStatement()) {
            val users = new ArrayList<User>();
            val resultSet = statement.executeQuery(FIND_ALL_USERS);

            while (resultSet.next()) {
                users.add(new User()
                        .setId(resultSet.getLong("user_id"))
                        .setUsername(resultSet.getString("username"))
                        .setPassword(resultSet.getString("password"))
                        .setRole(User.ROLE.valueOf(resultSet.getString("role")))
                        .setBalance(resultSet.getInt("balance")));
            }

            return users;

        } catch (SQLException e) {
            e.printStackTrace();

        } finally {
            ConnectionPool.INSTANCE.releaseConnection(connection);
        }

        return Collections.emptyList();
    }

    @Override
    public boolean updateBalance(String username, Integer newBalance) {
        val connection = ConnectionPool.INSTANCE.getConnection();

        try (val preparedStatement = connection.prepareStatement(UPDATE_BALANCE)) {
            preparedStatement.setInt(1, newBalance);
            preparedStatement.setString(2, username);
            return preparedStatement.execute();

        } catch (SQLException e) {
            e.printStackTrace();
            return false;

        } finally {
            ConnectionPool.INSTANCE.releaseConnection(connection);
        }
    }
}
