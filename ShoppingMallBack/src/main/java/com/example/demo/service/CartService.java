package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dao.ProductDao;
import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CartService {
    private final CartDao cartDao;
    private final ProductDao productDao;

    // 1. 장바구니 조회
    public CartDTO getCartByEmail(String email) {
        CartDTO cart = cartDao.getCartByEmail(email);
        if (cart == null) {
            throw new IllegalStateException("회원가입 시 cart가 생성되지 않았습니다: " + email);
        }
        return cart;
    }

    // 2. 상품 추가
    public CartItemDTO addToCart(Long c_no, String c_productId, int count) {
        CartItem existing = cartDao.findCartItem(c_no, c_productId);
        CartItem resultItem;

        if (existing == null) {
            CartItem newItem = new CartItem();
            newItem.setC_no(c_no);
            newItem.setC_productId(c_productId);
            newItem.setC_count(count);
            cartDao.insertCartItem(newItem);
            resultItem = newItem; // ✅ 새로 추가된 CartItem 반환
        } else {
            cartDao.updateCartItemCount(c_no, c_productId, count);
            existing.setC_count(existing.getC_count() + count);
            resultItem = existing; // ✅ 업데이트된 CartItem 반환
        }
        // ✅ 상품 정보를 조회하여 CartItemDTO를 생성
        Product productInfo = productDao.getById(c_productId);
        return CartItemDTO.builder()
                .ci_no(resultItem.getCi_no())
                .c_no(resultItem.getC_no())
                .c_productId(resultItem.getC_productId())
                .c_count(resultItem.getC_count())
                .p_title(productInfo.getP_title())
                .p_lprice(productInfo.getP_lprice())
                .p_image(productInfo.getP_image())
                .build();
    }

    // 3. 수량 변경
    public CartDTO updateCartItemCount(Long c_no, String productId, int addCount) {
        cartDao.updateCartItemCount(c_no, productId, addCount);
        String email = cartDao.findEmailByCart(c_no); // ✅ c_no 기준으로 email 조회
        return getCartByEmail(email);
    }

    // 4. 단일 삭제
    public CartDTO removeCartItem(Long ci_no, String email) {
        cartDao.deleteCartItem(ci_no);
        return getCartByEmail(email);
    }

    // 5. 전체 삭제
    public CartDTO clearCartByEmail(String email) {
        cartDao.deleteCartItemsByEmail(email);
        return getCartByEmail(email);
    }
}
