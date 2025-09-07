package com.example.demo.controller;

import com.example.demo.model.Cart;
import com.example.demo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {
    private final CartService service;

    @PostMapping
    public ResponseEntity<Long> register(@RequestBody Cart req) {
        return ResponseEntity.ok(service.register(req));
    }

    @GetMapping("/{no}")
    public ResponseEntity<Cart> getByNo(@PathVariable Long no) {
        return ResponseEntity.ok(service.getByNo(no));
    }

    @GetMapping("/member/{email}")
    public ResponseEntity<List<Cart>> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.getByEmail(email));
    }

    @GetMapping
    public ResponseEntity<List<Cart>> getAllCart() {
        return ResponseEntity.ok(service.getAllCart());
    }

    @PatchMapping("/{no}/count")
    public ResponseEntity<Void> updateCount(@PathVariable Long no, @RequestBody int count) {
        service.updateCount(no, count);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> delete(@PathVariable Long no) {
        service.delete(no);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/member/{email}")
    public ResponseEntity<Void> clearByEmail(@PathVariable String email) {
        service.clearByEmail(email);
        return ResponseEntity.noContent().build();
    }
}
