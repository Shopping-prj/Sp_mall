//package com.example.demo.controller;
//
//import com.example.demo.dto.CartAddRequestDTO;
//import com.example.demo.dto.CartDTO;
//import com.example.demo.dto.CartItemDTO;
//import com.example.demo.model.CartItem;
//import com.example.demo.service.CartService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/carts")
//@RequiredArgsConstructor
//public class CartController {
//
//    private final CartService cartService;
//
//    // 1. 장바구니 조회
//    @GetMapping()
//    public ResponseEntity<CartDTO> getCart(@RequestParam String email) {
//        return ResponseEntity.ok(cartService.getCartByEmail(email));
//    }
//
//    // 2. 상품 추가
//    @PostMapping("/add")
//    public ResponseEntity<CartDTO> addToCart(@RequestBody CartAddRequestDTO cartAddReqDTO) {
//        CartDTO cart = cartService.getCartByEmail(cartAddReqDTO.getEmail());
//        cartService.addToCart(cart.getC_no(), cartAddReqDTO.getProductId(), cartAddReqDTO.getCount());
//        return ResponseEntity.ok(cartService.getCartByEmail(cartAddReqDTO.getEmail()));
//    }
//
//    // 3. 수량 변경
//    @PutMapping("/update")
//    public ResponseEntity<CartDTO> updateCartCount(
//            @RequestParam Long c_no,
//            @RequestParam String c_productId,
//            @RequestParam int addCount) {
//        return ResponseEntity.ok(cartService.updateCartItemCount(c_no, c_productId, addCount));
//    }
//
//    // 4. 단일 삭제
//    @DeleteMapping("/item")
//    public ResponseEntity<CartDTO> removeCartItem(
//            @RequestParam Long ci_no,
//            @RequestParam String email) {
//        return ResponseEntity.ok(cartService.removeCartItem(ci_no, email));
//    }
//
//    // 5. 전체 삭제
//    @DeleteMapping("/clear")
//    public ResponseEntity<CartDTO> clearCart(@RequestParam String email) {
//        return ResponseEntity.ok(cartService.clearCartByEmail(email));
//    }
//}
