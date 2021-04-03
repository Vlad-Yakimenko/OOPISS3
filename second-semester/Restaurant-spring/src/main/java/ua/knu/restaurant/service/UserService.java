package ua.knu.restaurant.service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ua.knu.restaurant.dto.user.UserReadDto;
import ua.knu.restaurant.persistence.repository.UserRepository;
import ua.knu.restaurant.service.mapper.UserMapper;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class UserService {

    private UserRepository userRepository;
    private UserMapper userMapper;

    public UserReadDto login(String username, String password) {
        return userMapper.entityToDto(userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect user or password")));
    }
}
