package com.example.demo.dao;

import com.example.demo.model.Product;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ProductDao {
    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.ProductMapper.";

    public int insert(Product product) {
        return sqlSession.insert(NS + "insert", product);
    }

    public Product getById(String id) {
        return sqlSession.selectOne(NS + "getById", id);
    }

    public List<Product> getAll() {
        return sqlSession.selectList(NS + "getAll");
    }

    public int update(Product product) {
        return sqlSession.update(NS + "update", product);
    }

    public int deleteById(String id) {
        return sqlSession.delete(NS + "deleteById", id);
    }

    public List<Product> getByCategory(String category) {
        return sqlSession.selectList(NS + "getByCategory", category);
    }

    public List<Product> search(String keyword) {
        return sqlSession.selectList(NS + "ProductMapper.search", keyword);
    }
}
