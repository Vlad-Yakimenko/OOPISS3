package ua.knu.restaurant.dto.user;

import lombok.Value;
import ua.knu.restaurant.persistence.domain.User;

@Value
public class UserWriteDto {
    String username;
    String password;
    User.Role role;
}
