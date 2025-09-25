package com.example.demo.dao.admin;

import com.example.demo.model.admin.AdminProduct;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AdminProductDao {

    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.admin.AdminProductMapper.";

    public AdminProduct findById(String productId) {
        return sqlSession.selectOne(NS + "findById", productId);
    }

    public int update(AdminProduct product) {
        return sqlSession.update(NS + "update", product);
    }

    public int insert(AdminProduct product) {
        return sqlSession.insert(NS + "insert", product);
    }

    public int delete(String productId) {
        return sqlSession.delete(NS + "delete", productId);
    }
}