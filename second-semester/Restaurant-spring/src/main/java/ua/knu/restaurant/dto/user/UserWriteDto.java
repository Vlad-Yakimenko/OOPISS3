package ua.knu.restaurant.dto.user;

import ua.knu.restaurant.persistence.domain.User;

public class UserWriteDto {
    String username;
    String password;
    User.Role role;
}
