// CartController.java
package com.example.demo.controller;

import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CartController
 * - REST API 엔드포인트
 * - Service 호출 후 DTO 반환
 */
@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    /** 장바구니에 상품 추가 */
    @PostMapping
    public ResponseEntity<Void> addToCart(@RequestParam String email,
                                          @RequestParam String productId,
                                          @RequestParam(defaultValue = "1") int count) {
        cartService.addToCart(email, productId, count);
        return ResponseEntity.ok().build();
    }

    /** 회원별 장바구니 조회 */
    @GetMapping("/{email}")
    public ResponseEntity<CartDTO> getCart(@PathVariable String email) {
        return ResponseEntity.ok(cartService.getCartWithItems(email));
    }

    /** 장바구니 아이템 수량 변경 */
    @PatchMapping("/item/{ciNo}")
    public ResponseEntity<Void> updateCount(@PathVariable Long ciNo, @RequestParam int count) {
        cartService.updateCount(ciNo, count);
        return ResponseEntity.noContent().build();
    }

    /** 장바구니 아이템 삭제 */
    @DeleteMapping("/item/{ciNo}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long ciNo) {
        cartService.deleteItem(ciNo);
        return ResponseEntity.noContent().build();
    }

    /** 장바구니 전체 비우기 */
    @DeleteMapping("/clear/{email}")
    public ResponseEntity<Void> clearCart(@PathVariable String email) {
        cartService.clearCart(email);
        return ResponseEntity.noContent().build();
    }

    /** guest_cart → DB 병합 */
    @PostMapping("/merge")
    public ResponseEntity<Void> mergeGuestCart(@RequestBody List<CartItemDTO> guestItems) {
        cartService.mergeGuestCart(guestItems);
        return ResponseEntity.ok().build();
    }
}
