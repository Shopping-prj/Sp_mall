// CartService.java
package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * CartService
 * - 비즈니스 로직 처리
 * - DAO(Entity) → DTO 변환 담당
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final CartDao cartDao;

    /** 장바구니 담기 */
    public void addToCart(String email, String productId, int count) {
        Cart cart = cartDao.getCartByEmail(email);
        if (cart == null) {
            cart = new Cart();
            cart.setC_email(email);
            cartDao.insertCart(cart);
        }

        CartItem exist = cartDao.getCartItem(cart.getC_no(), productId);
        if (exist == null) {
            CartItem item = CartItem.builder()
                    .c_no(cart.getC_no())
                    .c_productId(productId)
                    .c_count(count)
                    .build();
            cartDao.insertCartItem(item);
        } else {
            cartDao.increaseCount(cart.getC_no(), productId, count);
        }
    }

    /** 회원 장바구니 조회 → DTO 변환 */
    public CartDTO getCartWithItems(String email) {
        Cart cart = cartDao.getCartByEmail(email);
        if (cart == null) return null;

        List<CartItem> items = cartDao.getCartItems(cart.getC_no());

        // Entity → DTO 변환
        List<CartItemDTO> itemDTOs = items.stream()
                .map(item -> CartItemDTO.builder()
                        .ci_no(item.getCi_no())
                        .c_no(item.getC_no())
                        .c_productId(item.getC_productId())
                        .c_count(item.getC_count())
                        .c_email(email)
                        .build())
                .collect(Collectors.toList());

        CartDTO dto = new CartDTO();
        dto.setC_no(cart.getC_no());
        dto.setC_email(cart.getC_email());
        dto.setItems(itemDTOs);
        return dto;
    }

    /** 장바구니 수량 변경 */
    public void updateCount(Long ciNo, int count) {
        cartDao.updateCount(ciNo, count);
    }

    /** 장바구니 아이템 삭제 */
    public void deleteItem(Long ciNo) {
        cartDao.deleteCartItem(ciNo);
    }

    /** 장바구니 전체 비우기 */
    public void clearCart(String email) {
        cartDao.deleteCartByEmail(email);
    }

    /** guest_cart 병합 */
    public void mergeGuestCart(List<CartItemDTO> guestItems) {
        if (guestItems == null || guestItems.isEmpty()) return;

        String email = guestItems.get(0).getC_email();
        Cart cart = cartDao.getCartByEmail(email);

        if (cart == null) {
            cart = new Cart();
            cart.setC_email(email);
            cartDao.insertCart(cart);
        }

        for (CartItemDTO dto : guestItems) {
            CartItem exist = cartDao.getCartItem(cart.getC_no(), dto.getC_productId());
            if (exist == null) {
                CartItem item = CartItem.builder()
                        .c_no(cart.getC_no())
                        .c_productId(dto.getC_productId())
                        .c_count(dto.getC_count())
                        .build();
                cartDao.insertCartItem(item);
            } else {
                cartDao.increaseCount(cart.getC_no(), dto.getC_productId(), dto.getC_count());
            }
        }
    }
}
