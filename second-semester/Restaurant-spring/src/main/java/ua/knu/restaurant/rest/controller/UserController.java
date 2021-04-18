package ua.knu.restaurant.rest.controller;

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.knu.restaurant.dto.CredentialsDto;
import ua.knu.restaurant.dto.user.UserReadDto;
import ua.knu.restaurant.dto.user.UserWriteDto;
import ua.knu.restaurant.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class UserController {

    private UserService userService;

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success"),
            @ApiResponse(code = 400, message = "Bad request"),
            @ApiResponse(code = 404, message = "Not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    public String testEndpoint() {
        return "Hello, world!";
    }

    @PostMapping
    public UserReadDto create(@RequestBody UserWriteDto user) {
        return null;
    }

    @PutMapping
    public UserReadDto login(@RequestBody CredentialsDto credentials) {
        return userService.login(credentials.getUsername(), credentials.getPassword());
    }

    @PostMapping(path = "/register")
    public ResponseEntity<Void> register(@RequestBody UserWriteDto user) {
        userService.register(user);
        return ResponseEntity.ok().build();
    }
}
