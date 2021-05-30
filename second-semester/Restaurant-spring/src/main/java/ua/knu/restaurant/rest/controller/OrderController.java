package ua.knu.restaurant.rest.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.adapters.springsecurity.account.SimpleKeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.knu.restaurant.dto.order.OrderReadDto;
import ua.knu.restaurant.dto.order.OrderWriteDto;
import ua.knu.restaurant.persistence.domain.Order;
import ua.knu.restaurant.service.OrderService;

import javax.annotation.security.RolesAllowed;
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
    @RolesAllowed("app-user")
    public ResponseEntity<Void> checkout(@RequestBody OrderWriteDto orderWriteDto, Principal principal) {
        var authenticationToken = (KeycloakAuthenticationToken) principal;
        var simpleKeycloakAccount = (SimpleKeycloakAccount) authenticationToken.getDetails();
        var username = simpleKeycloakAccount.getPrincipal().getName();

        log.info("Retrieved order from {}", username);

        orderService.checkout(orderWriteDto.setUsername(username));

        log.info("Order from {} was processed", username);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    @RolesAllowed("app-admin")
    public List<OrderReadDto> getAll() {
        return orderService.getAll();
    }

    @GetMapping(path = "/{userId}")
    @RolesAllowed({"app-admin", "app-user"})
    public List<OrderReadDto> getAllForUser(@PathVariable Integer userId) {
        log.info("Retrieving all orders for the user with id '{}'", userId);
        return orderService.getAllByUserId(userId);
    }

    @PatchMapping(path = "/{orderId}")
    @RolesAllowed("app-admin")
    public ResponseEntity<Order.OrderStatus> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
        var optionalOrder = orderService.getByOrderId(orderId);

        if (optionalOrder.isPresent()) {
            var order = optionalOrder.get();
            var orderStatus = Order.OrderStatus.valueOf(status);

            orderService.updateOrder(order.setStatus(orderStatus));

            return ResponseEntity.ok(orderStatus);

        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
