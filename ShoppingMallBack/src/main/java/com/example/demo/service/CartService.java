package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CartService {
    private final CartDao cartDao;

    // 1. 장바구니 조회
    public CartDTO getCartByEmail(String email) {
        // 회원가입 시 cart는 항상 생성됨
        CartDTO cart = cartDao.getCartByEmail(email);
        if (cart == null) {
            throw new IllegalStateException("회원가입 시 cart가 생성되지 않았습니다: " + email);
        }
        return cart;
    }

    // 2. 상품 추가
    public CartDTO addToCart(String email, String productId, int count) {
        // cart는 항상 존재한다고 가정
        Cart cart = cartDao.findCartEntityByEmail(email);
        System.out.println("=== DEBUG: findCartEntityByEmail result ===");
        System.out.println("email");
        // cart_item 처리
        CartItemDTO item = cartDao.findCartItem(cart.getC_no(), productId);
        System.out.println("c_no");
        System.out.println(email);
        if (item != null) {
            System.out.println("NULL 반환됨 (email=" + email + ")");
            cartDao.updateCartItemCount(item.getCi_no(), item.getC_count() + count);
        } else {
            cartDao.insertCartItem(new CartItem(null, cart.getC_no(), productId, count));
            System.out.println("c_no=" + cart.getC_no() + ", c_email=" + cart.getC_email());
        }

        return cartDao.getCartByEmail(email);
    }

    // 3. 수량 변경
    public CartDTO updateCartCount(Long ci_no, int count) {
        cartDao.updateCartItemCount(ci_no, count);
        String email = cartDao.findEmailByCartItem(ci_no);
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
