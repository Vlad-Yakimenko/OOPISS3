package ua.knu.restaurant.service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import ua.knu.restaurant.dto.user.UserReadDto;
import ua.knu.restaurant.persistence.domain.User;
import ua.knu.restaurant.persistence.repository.UserRepository;
import ua.knu.restaurant.service.mapper.UserMapper;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class UserService {

    private UserRepository userRepository;
    private UserMapper userMapper;

    public UserReadDto findByUsername(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        return optionalUser.map(userMapper::entityToDto).orElse(null);
    }
}
