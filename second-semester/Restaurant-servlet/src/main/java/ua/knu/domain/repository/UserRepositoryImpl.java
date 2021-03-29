package ua.knu.domain.repository;

import lombok.RequiredArgsConstructor;
import ua.knu.domain.database.DatabaseManager;
import ua.knu.domain.model.User;

import java.sql.*;
import java.util.*;

@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private static final String SAVE_USER = "INSERT INTO users (name, role) VALUES (?, ?);";
    private static final String FIND_ALL_USERS = "SELECT * FROM users;";

    private final DatabaseManager databaseManager;

    @Override
    public <S extends User> S save(S entity) {
        try (Connection connection = databaseManager.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(FIND_ALL_USERS)) {

//            preparedStatement.setString(entity.get);


        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public <S extends User> Iterable<S> saveAll(Iterable<S> entities) {
        return null;
    }

    @Override
    public Optional<User> findById(Long aLong) {
        return Optional.empty();
    }

    @Override
    public Optional<User> findByUsernameAndPassword(String username, String password) {
        return findAll().stream()
                .filter(user -> user.getUsername().equals(username) && user.getPassword().equals(password))
                .findFirst();
    }

    @Override
    public Collection<User> findAll() {
        try (Connection connection = databaseManager.getConnection();
             Statement statement = connection.createStatement()) {

            List<User> users = new ArrayList<>();
            ResultSet resultSet = statement.executeQuery(FIND_ALL_USERS);

            while (resultSet.next()) {
                users.add(new User()
                        .setId(resultSet.getLong("id"))
                        .setUsername(resultSet.getString("username"))
                        .setPassword(resultSet.getString("password"))
                        .setRole(User.ROLE.valueOf(resultSet.getString("role"))));
            }

            return users;

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public void delete(User entity) {

    }

    @Override
    public void deleteAll(Iterable<? extends User> entities) {

    }
}
