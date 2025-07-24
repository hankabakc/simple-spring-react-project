package com.table.table.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.table.table.dto.response.OrderResponse;
import com.table.table.model.CartItem;
import com.table.table.model.Order;
import com.table.table.model.User;
import com.table.table.repository.CartItemRepository;
import com.table.table.repository.OrderRepository;
import com.table.table.repository.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
            CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getOrderGroupId(),
                order.getUser().getUsername(),
                order.getName(),
                order.getPrice(),
                order.getQuantity());
    }

    /*
     * public OrderResponse createOrder(String username, OrderRequest request) {
     * User user = userRepository.findByUsername(username)
     * .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
     * "User not found"));
     * 
     * Order order = new Order();
     * order.setUser(user);
     * order.setName(request.getName());
     * order.setPrice(request.getPrice());
     * order.setQuantity(request.getQuantity());
     * order.setOrderGroupId(System.currentTimeMillis());
     * 
     * return toResponse(orderRepository.save(order));
     * }
     */

    @Transactional
    public List<OrderResponse> createOrdersFromCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sepet boş");
        }

        long groupId = System.currentTimeMillis();

        List<Order> orders = cartItems.stream().map(item -> {
            Order order = new Order();
            order.setUser(user);
            order.setName(item.getProduct().getName());
            order.setPrice(item.getProduct().getPrice());
            order.setQuantity(item.getQuantity());
            order.setOrderGroupId(groupId);
            return order;
        }).toList();

        List<Order> saved = orderRepository.saveAll(orders);
        cartItemRepository.deleteAll(cartItems);

        return saved.stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> getOrdersByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return orderRepository.findByUser(user).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OrderResponse> searchOrders(String username, String productName, BigDecimal minPrice,
            BigDecimal maxPrice) {
        return orderRepository.findAll().stream()
                .filter(order -> username == null
                        || order.getUser().getUsername().toLowerCase().contains(username.toLowerCase()))
                .filter(order -> productName == null
                        || order.getName().toLowerCase().contains(productName.toLowerCase()))
                .filter(order -> minPrice == null || order.getPrice().compareTo(minPrice) >= 0)
                .filter(order -> maxPrice == null || order.getPrice().compareTo(maxPrice) <= 0)
                .map(this::toResponse)
                .toList();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public void deleteOrderById(Long id) {
        orderRepository.deleteById(id);
    }
}
