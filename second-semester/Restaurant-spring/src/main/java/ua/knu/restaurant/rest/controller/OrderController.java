package ua.knu.restaurant.rest.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.knu.restaurant.dto.order.OrderReadDto;
import ua.knu.restaurant.dto.order.OrderWriteDto;
import ua.knu.restaurant.service.OrderService;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping(path = "/orders")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
@CrossOrigin("http://localhost:4200")
public class OrderController {

    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Void> checkout(@RequestBody OrderWriteDto orderWriteDto, Principal principal) {
//        KeycloakAuthenticationToken kp = (KeycloakAuthenticationToken) principal;
//        SimpleKeycloakAccount simpleKeycloakAccount = (SimpleKeycloakAccount) kp.getDetails();
//        simpleKeycloakAccount.getKeycloakSecurityContext().getToken();

        orderService.checkout(orderWriteDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
//    @RolesAllowed("app-admin")
    public List<OrderReadDto> getAll() {
        return orderService.getAll();
    }

    @GetMapping(path = "/{userId}")
//    @RolesAllowed("app-user")
    public List<OrderReadDto> getAllForUser(@PathVariable Integer userId) {
        return orderService.getAllByUserId(userId);
    }
}
