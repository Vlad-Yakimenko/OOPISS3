package ua.knu.restaurant.dto.user;

import lombok.Value;
import ua.knu.restaurant.persistence.domain.User;

@Value
public class UserReadDto {
    Integer id;
    String username;
    String password;
    User.Role role;
}
