package ua.knu.restaurant.rest.controller;

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import ua.knu.restaurant.dto.user.UserReadDto;
import ua.knu.restaurant.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
@CrossOrigin("http://localhost:4200")
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

    @GetMapping("/{username}")
    public UserReadDto findByUsername(@PathVariable String username) {
        return userService.findByUsername(username);
    }
}
