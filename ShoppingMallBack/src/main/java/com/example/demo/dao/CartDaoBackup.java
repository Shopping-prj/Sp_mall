//package com.example.demo.dao;
//
//import com.example.demo.dto.CartItemDTO;
//import com.example.demo.model.Cart;
//import com.example.demo.model.CartItem;
//import lombok.RequiredArgsConstructor;
//import org.mybatis.spring.SqlSessionTemplate;
//import org.springframework.stereotype.Repository;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
///**
// * CartDao
// * - MyBatis DAO (Entity 중심, DTO는 Service에서 조합)
// * - 🔧 변경: getCartItemsWithProduct 추가
// * - 🔧 변경: insertCart 후 c_no null 검사 책임은 Service에서 수행(여기선 그대로)
// */
//@Repository
//@RequiredArgsConstructor
//public class CartDaoBackup {
//    private final SqlSessionTemplate sqlSession;
//    private static final String NS = "com.example.demo.dao.CartMapper.";
//
//    public Cart getCartByEmail(String email) {
//        return sqlSession.selectOne(NS + "getCartByEmail", email);
//    }
//
//    public int insertCart(Cart cart) {
//        return sqlSession.insert(NS + "insertCart", cart);
//    }
//
//    public CartItem getCartItem(Long c_no, String c_productId) {
//        Map<String, Object> param = new HashMap<>();
//        param.put("c_no", c_no);
//        param.put("c_productId", c_productId);
//        return sqlSession.selectOne(NS + "getCartItem", param);
//    }
//
//    public List<CartItemDTO> getCartItemsWithProduct(Long c_no) {
//        return sqlSession.selectList(NS + "getCartItemsWithProduct", c_no);
//    }
//
//    public int insertCartItem(CartItem item) {
//        return sqlSession.insert(NS + "insertCartItem", item);
//    }
//
//    public int increaseCount(Long c_no, String c_productId, int count) {
//        Map<String, Object> param = new HashMap<>();
//        param.put("c_no", c_no);
//        param.put("c_productId", c_productId);
//        param.put("c_count", count);
//        return sqlSession.update(NS + "increaseCount", param);
//    }
//
//    public int updateCount(Long ci_no, int count) {
//        CartItem param = new CartItem();
//        param.setCi_no(ci_no);
//        param.setC_count(count);
//        return sqlSession.update(NS + "updateCount", param);
//    }
//
//    public int deleteCartItem(Long ci_no) {
//        return sqlSession.delete(NS + "deleteCartItem", ci_no);
//    }
//
//    public int deleteCartByEmail(String email) {
//        return sqlSession.delete(NS + "deleteCartByEmail", email);
//    }
//}
