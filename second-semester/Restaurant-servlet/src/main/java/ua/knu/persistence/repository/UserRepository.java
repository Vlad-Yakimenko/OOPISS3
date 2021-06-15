package ua.knu.persistence.repository;

import ua.knu.persistence.model.User;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByUsernameAndPassword(String username, String password);

    Optional<User> findByUsername(String username);

    boolean updateBalance(String username, Integer newBalance);
}
