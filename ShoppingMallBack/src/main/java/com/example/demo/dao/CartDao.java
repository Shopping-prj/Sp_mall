package com.example.demo.dao;

import com.example.demo.dto.CartDTO;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class CartDao {
    private static final String NS = "com.example.demo.dao.CartMapper.";
    private final SqlSessionTemplate sql;

    // 1. 이메일로 CartDTO 조회 (Cart + Items)
    public CartDTO getCartByEmail(String email) {
        return sql.selectOne(NS + "getCartByEmail", email);
    }

    // 2. CartEntity 조회 (Cart row만)
    public Cart findCartEntityByEmail(String email) {
        return sql.selectOne(NS + "findCartEntityByEmail", email);
    }

    // 3. Cart 생성
    public void insertCart(Cart cart) {
        sql.insert(NS + "insertCart", cart);
    }

    // 4. c_no → email 조회
    public String findEmailByCart(Long c_no) {
        return sql.selectOne(NS + "findEmailByCart", c_no);
    }

    // 5. CartItem 조회 (특정 상품)
    public CartItem findCartItem(Long c_no, String productId) {
        Map<String, Object> params = new HashMap<>();
        params.put("c_no", c_no);
        params.put("c_productId", productId);
        return sql.selectOne(NS + "findCartItem", params);
    }

    // 6. CartItem 추가
    public void insertCartItem(CartItem item) {
        sql.insert(NS + "insertCartItem", item);
    }

    // 7. CartItem 수량 업데이트
    public int updateCartItemCount(Long c_no, String productId, int addCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("c_no", c_no);
        params.put("c_productId", productId);
        params.put("addCount", addCount);
        return sql.update(NS + "updateCartItemCount", params);
    }

    // 8. CartItem 단일 삭제
    public void deleteCartItem(Long ci_no) {
        sql.delete(NS + "deleteCartItem", ci_no);
    }

    // 9. 특정 회원 전체 아이템 삭제
    public void deleteCartItemsByEmail(String email) {
        sql.delete(NS + "deleteCartItemsByEmail", email);
    }
}
