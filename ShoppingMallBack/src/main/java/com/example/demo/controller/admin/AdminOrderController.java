package com.example.demo.controller.admin;

import com.example.demo.model.Order;
import com.example.demo.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> searchOrders(
            @RequestParam(required = false) String kwType,
            @RequestParam(required = false) String kw,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String status
    ) {
        Map<String, Object> param = new HashMap<>();
        param.put("kwType", kwType);
        param.put("kw", kw);
        param.put("from", from);
        param.put("to", to);
        param.put("status", status);

        return ResponseEntity.ok(orderService.searchOrders(param));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getOrderSummary() {
        return ResponseEntity.ok(orderService.getOrderSummary());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Order>> getRecentOrders() {
        return ResponseEntity.ok(orderService.getRecentOrders());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
