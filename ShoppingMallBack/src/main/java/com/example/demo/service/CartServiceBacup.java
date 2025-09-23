//package com.example.demo.service;
//
//import com.example.demo.dao.CartDaoBackup;
//import com.example.demo.dto.CartItemDTO;
//import com.example.demo.model.Cart;
//import com.example.demo.model.CartItem;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
///**
// * CartService
// * - 🔧 변경: getCartItems를 List<CartItemDTO>로 바로 반환(프론트가 배열을 기대)
// * - 🔧 변경: insertCart 후 c_no null 검증(정상 동작 보장)
// */
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class CartServiceBacup {
//    private final CartDaoBackup cartDao;
//
//    /** 장바구니 담기 */
//    public void addToCart(String email, String productId, int count) {
//        Cart cart = cartDao.getCartByEmail(email);
//        if (cart == null) {
//            cart = new Cart();
//            cart.setC_email(email);
//            cartDao.insertCart(cart);
//            // 🔐 중요: MyBatis useGeneratedKeys 로 c_no 가 채워져 있어야 함
//            if (cart.getC_no() == null) {
//                throw new IllegalStateException("장바구니 생성 실패: 생성된 c_no 가 null 입니다.");
//            }
//        }
//
//        CartItem exist = cartDao.getCartItem(cart.getC_no(), productId);
//        if (exist == null) {
//            CartItem item = CartItem.builder()
//                    .c_no(cart.getC_no())
//                    .c_productId(productId)
//                    .c_count(Math.max(count, 1)) // 음수/0 방지
//                    .build();
//            cartDao.insertCartItem(item);
//        } else {
//            cartDao.increaseCount(cart.getC_no(), productId, Math.max(count, 1));
//        }
//    }
//
//    /** 회원 장바구니 조회 → 프론트가 바로 쓰는 List<CartItemDTO> (상품정보 포함) */
//    public List<CartItemDTO> getItemsWithProductByEmail(String email) {
//        Cart cart = cartDao.getCartByEmail(email);
//        if (cart == null) return List.of();
//        return cartDao.getCartItemsWithProduct(cart.getC_no());
//    }
//
//    /** 수량 변경 */
//    public void updateCount(Long ciNo, int count) {
//        cartDao.updateCount(ciNo, Math.max(count, 1));
//    }
//
//    /** 단건 삭제 */
//    public void deleteItem(Long ciNo) {
//        cartDao.deleteCartItem(ciNo);
//    }
//
//    /** 장바구니 전체 비우기 */
//    public void clearCart(String email) {
//        cartDao.deleteCartByEmail(email);
//    }
//}
