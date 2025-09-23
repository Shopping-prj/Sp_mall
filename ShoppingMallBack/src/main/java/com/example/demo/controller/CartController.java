package com.example.demo.controller;

import com.example.demo.dto.CartDTO;
import com.example.demo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 1. 장바구니 조회
    @GetMapping()
    public ResponseEntity<CartDTO> getCart(@RequestParam String email) {
        return ResponseEntity.ok(cartService.getCartByEmail(email));
    }

    // 2. 상품 추가
    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @RequestParam String email,
            @RequestParam String productId,
            @RequestParam(defaultValue = "1") int count) {
        return ResponseEntity.ok(cartService.addToCart(email, productId, count));
    }

    // 3. 수량 변경
    @PutMapping("/update")
    public ResponseEntity<CartDTO> updateCartCount(
            @RequestParam Long ci_no,
            @RequestParam int count) {
        return ResponseEntity.ok(cartService.updateCartCount(ci_no, count));
    }

    // 4. 단일 삭제
    @DeleteMapping("/item")
    public ResponseEntity<CartDTO> removeCartItem(
            @RequestParam Long ci_no,
            @RequestParam String email) {
        return ResponseEntity.ok(cartService.removeCartItem(ci_no, email));
    }

    // 5. 전체 삭제
    @DeleteMapping("/clear")
    public ResponseEntity<CartDTO> clearCart(@RequestParam String email) {
        return ResponseEntity.ok(cartService.clearCartByEmail(email));
    }
}
