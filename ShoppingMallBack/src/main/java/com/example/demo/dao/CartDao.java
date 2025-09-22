// CartDao.java
package com.example.demo.dao;

import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CartDao
 * - MyBatis를 사용하여 DB에 접근
 * - 무조건 Entity(Cart, CartItem)만 반환
 * - DTO는 Service 계층에서 변환
 */
@Repository
@RequiredArgsConstructor
public class CartDao {
    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.CartMapper.";

    /** 회원 이메일 기준으로 Cart 단건 조회 */
    public Cart getCartByEmail(String email) {
        return sqlSession.selectOne(NS + "getCartByEmail", email);
    }

    /** 회원별 Cart 생성 */
    public int insertCart(Cart cart) {
        return sqlSession.insert(NS + "insertCart", cart);
    }

    /** 특정 Cart에 담긴 모든 CartItem 조회 */
    public List<CartItem> getCartItems(Long c_no) {
        return sqlSession.selectList(NS + "getCartItems", c_no);
    }

    /** 특정 Cart + 상품 기준으로 CartItem 조회 */
    public CartItem getCartItem(Long c_no, String c_productId) {
        Map<String, Object> param = new HashMap<>();
        param.put("c_no", c_no);
        param.put("c_productId", c_productId);
        return sqlSession.selectOne(NS + "getCartItem", param);
    }

    /** 장바구니에 CartItem 추가 */
    public int insertCartItem(CartItem item) {
        return sqlSession.insert(NS + "insertCartItem", item);
    }

    /** 특정 상품 수량 증가 */
    public int increaseCount(Long c_no, String c_productId, int count) {
        Map<String, Object> param = new HashMap<>();
        param.put("c_no", c_no);
        param.put("c_productId", c_productId);
        param.put("c_count", count);
        return sqlSession.update(NS + "increaseCount", param);
    }

    /** 특정 CartItem 수량 수정 */
    public int updateCount(Long ci_no, int count) {
        CartItem param = new CartItem();
        param.setCi_no(ci_no);
        param.setC_count(count);
        return sqlSession.update(NS + "updateCount", param);
    }

    /** 특정 CartItem 삭제 */
    public int deleteCartItem(Long ci_no) {
        return sqlSession.delete(NS + "deleteCartItem", ci_no);
    }

    /** 특정 회원 장바구니 전체 삭제 (Cart 삭제 시 CartItem도 Cascade) */
    public int deleteCartByEmail(String email) {
        return sqlSession.delete(NS + "deleteCartByEmail", email);
    }
}
