package com.example.demo.dao;

import com.example.demo.model.Cart;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CartDao {
    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.CartMapper.";

    public int insert(Cart cart) {
        return sqlSession.insert(NS + "insert", cart);
    }

    public Cart getByNo(Long no) {
        return sqlSession.selectOne(NS + "getByNo", no);
    }

    public List<Cart> getByEmail(String email) {
        return sqlSession.selectList(NS + "getByEmail", email);
    }

    public List<Cart> getAllCart() {
        return sqlSession.selectList(NS + "getAllCart");
    }

    public int updateCount(Long no, int count) {
        Cart param = new Cart();
        param.setC_no(no);
        param.setC_count(count);
        return sqlSession.update(NS + "update", param);
    }

    public int deleteByNo(Long no) {
        return sqlSession.delete(NS + "deleteByNo", no);
    }

    public int deleteByEmail(String email) {
        return sqlSession.delete(NS + "deleteByEmail", email);
    }
}
