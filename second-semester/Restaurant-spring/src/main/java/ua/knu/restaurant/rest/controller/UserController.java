package ua.knu.restaurant.rest.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.knu.restaurant.dto.user.UserReadDto;
import ua.knu.restaurant.service.OrderService;
import ua.knu.restaurant.service.UserService;
import ua.knu.restaurant.service.mapper.UserMapper;

import javax.annotation.security.RolesAllowed;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
@CrossOrigin("http://localhost:4200")
public class UserController {

    private UserService userService;
    private OrderService orderService;
    private UserMapper userMapper;

    @GetMapping("/{username}")
    @RolesAllowed({"app-user", "app-admin"})
    public ResponseEntity<UserReadDto> findByUsername(@PathVariable String username) {
        var optionalUser = userService.findByUsername(username)
                .map(userMapper::entityToDto);

        if (optionalUser.isPresent()) {
            var user = optionalUser.get();
            optionalUser = Optional.of(user.setOrders(orderService.getAllByUserId(user.getId())));
        }

        return ResponseEntity.of(optionalUser);
    }

    @PatchMapping("/{username}")
    @RolesAllowed("app-admin")
    public ResponseEntity<UserReadDto> updateBalance(@PathVariable String username, @RequestParam Integer balance) {
        var optionalUser = userService.findByUsername(username);

        if (optionalUser.isPresent()) {
            var user = optionalUser.get();
            userService.updateUser(user.setBalance(balance));
            return ResponseEntity.ok(
                    userMapper.entityToDto(user)
                            .setOrders(orderService.getAllByUserId(user.getId()))
            );

        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
