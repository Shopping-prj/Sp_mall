//package com.example.demo.controller;
//
//import com.example.demo.dto.CartItemDTO;
//import com.example.demo.service.CartServiceBacup;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
///**
// * CartController
// * 🔧 변경 핵심:
// * 1) GET /api/carts/{email} → List<CartItemDTO> (배열) 반환
// *    - 프론트가 setCartItems(data)로 바로 쓰도록 맞춤
// * 2) POST /api/carts → @RequestParam(email, productId, count)
// *    - 프론트 service/cartDB.js의 axios 객체 호출(params)과 1:1 매칭
// */
//@RestController
//@RequestMapping("/api/carts")
//@RequiredArgsConstructor
//public class CartControllerBackup {
//    private final CartServiceBacup cartService;
//
//    /** 장바구니에 상품 추가 */
//    @PostMapping
//    public ResponseEntity<Void> addToCart(@RequestParam String email,
//                                          @RequestParam String productId,
//                                          @RequestParam(defaultValue = "1") int count) {
//        cartService.addToCart(email, productId, count);
//        return ResponseEntity.ok().build();
//    }
//
//    /** 회원별 장바구니 조회 → 배열(List<CartItemDTO>) 반환 */
//    @GetMapping("/{email}")
//    public ResponseEntity<List<CartItemDTO>> getCart(@PathVariable String email) {
//        return ResponseEntity.ok(cartService.getItemsWithProductByEmail(email));
//    }
//
//    /** 장바구니 아이템 수량 변경 */
//    @PatchMapping("/item/{ciNo}")
//    public ResponseEntity<Void> updateCount(@PathVariable Long ciNo, @RequestParam int count) {
//        cartService.updateCount(ciNo, count);
//        return ResponseEntity.noContent().build();
//    }
//
//    /** 장바구니 아이템 삭제 */
//    @DeleteMapping("/item/{ciNo}")
//    public ResponseEntity<Void> deleteItem(@PathVariable Long ciNo) {
//        cartService.deleteItem(ciNo);
//        return ResponseEntity.noContent().build();
//    }
//
//    /** 장바구니 전체 비우기 */
//    @DeleteMapping("/clear/{email}")
//    public ResponseEntity<Void> clearCart(@PathVariable String email) {
//        cartService.clearCart(email);
//        return ResponseEntity.noContent().build();
//    }
//}
