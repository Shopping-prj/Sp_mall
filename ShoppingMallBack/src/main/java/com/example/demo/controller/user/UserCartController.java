package com.example.demo.controller.user;

import com.example.demo.config.JwtUtil;
import com.example.demo.dto.CartAddRequestDTO;
import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class UserCartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;

    // 🔹 Authorization 헤더에서 이메일 추출하는 헬퍼
    private String extractEmail(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return jwtUtil.extractEmailFromHeader(header);
    }

    // 1. 장바구니 조회
    @GetMapping
    public ResponseEntity<CartDTO> getCart(HttpServletRequest request) {
        String email = extractEmail(request);
        return ResponseEntity.ok(cartService.getCartByEmail(email));
    }

    // 2. 상품 추가
    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(
            HttpServletRequest request,
            @RequestBody CartAddRequestDTO cartAddReqDTO) {
        String email = extractEmail(request);
        CartDTO cart = cartService.getCartByEmail(email);

        CartItemDTO addedItem = cartService.addToCart(
                cart.getC_no(),
                cartAddReqDTO.getProductId(),
                cartAddReqDTO.getCount()
        );
        return ResponseEntity.ok(addedItem);
    }

    // 3. 수량 변경
    @PutMapping("/update")
    public ResponseEntity<CartDTO> updateCartCount(
            HttpServletRequest request,
            @RequestParam String c_productId,
            @RequestParam int addCount) {
        String email = extractEmail(request);
        CartDTO cart = cartService.getCartByEmail(email);
        return ResponseEntity.ok(cartService.updateCartItemCount(cart.getC_no(), c_productId, addCount));
    }

    // 4. 단일 아이템 삭제
    @DeleteMapping("/item")
    public ResponseEntity<CartDTO> removeCartItem(
            HttpServletRequest request,
            @RequestParam Long ci_no) {
        String email = extractEmail(request);
        return ResponseEntity.ok(cartService.removeCartItem(ci_no, email));
    }

    // 5. 전체 아이템 삭제
    @DeleteMapping("/clear")
    public ResponseEntity<CartDTO> clearCart(HttpServletRequest request) {
        String email = extractEmail(request);
        return ResponseEntity.ok(cartService.clearCartByEmail(email));
    }
}
