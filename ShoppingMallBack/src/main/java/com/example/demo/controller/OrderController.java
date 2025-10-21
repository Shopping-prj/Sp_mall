package com.example.demo.controller;

import com.example.demo.dto.OrderItemDTO;
import com.example.demo.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Log4j2
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // 1. 회원주문 조회
    @GetMapping()
    public ResponseEntity<List<OrderItemDTO>> getOrder(@RequestParam String o_email) {
        return ResponseEntity.ok(orderService.getOrderByEmail(o_email));
    }

    // 2. 회원별 주문품목 이름검색
    @PostMapping("/search")
    public ResponseEntity<List<OrderItemDTO>> searchToOrder(@RequestBody Map<String, String> searchParams) {
        return ResponseEntity.ok(orderService.searchToOrder(searchParams));
    }

    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<OrderItemDTO>>> getOrdersGrouped(@RequestParam String o_email) {
        List<OrderItemDTO> list = orderService.getOrderByEmail(o_email);
        Map<String, List<OrderItemDTO>> grouped = list.stream()
                .collect(Collectors.groupingBy(o -> o.getO_created_at().toString().substring(0, 10)));
        return ResponseEntity.ok(grouped);
    }

}