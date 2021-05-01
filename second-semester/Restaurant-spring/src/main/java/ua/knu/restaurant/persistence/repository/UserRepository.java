package ua.knu.restaurant.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.knu.restaurant.persistence.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}
