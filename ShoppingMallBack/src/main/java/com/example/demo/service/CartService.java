package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.http11.filters.SavedRequestInputFilter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

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
    public CartItem addToCart(Long c_no, String c_productId, int count) {
        CartItem existing = cartDao.findCartItem(c_no, c_productId);
        System.out.println("👉 existing = " + existing);

        if (existing == null) {
            System.out.println("👉 신규 상품, insert 실행");
            CartItem newItem = new CartItem();
            newItem.setC_no(c_no);
            newItem.setC_productId(c_productId);
            newItem.setC_count(count);
            cartDao.insertCartItem(newItem);
            return newItem;
        } else {
            System.out.println("👉 기존 상품, update 실행");
            updateCartItemCount(c_no, c_productId, count);
            existing.setC_count(existing.getC_count() + count);
            return existing;
        }
    }

    // 3. 수량 변경
    public CartDTO updateCartItemCount(Long c_no, String productId, int addCount) {
        cartDao.updateCartItemCount(c_no, productId, addCount);
        String email = cartDao.findEmailByCartItem(c_no);
        return getCartByEmail(email); // DTO 반환
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
