package com.example.demo.dao;

import com.example.demo.model.Order;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class OrderDao {

    private final SqlSessionTemplate sql;
    private static final String NS = "com.example.demo.dao.OrderMapper.";

    public List<Order> searchOrders(Map<String, Object> param) {
        return sql.selectList(NS + "searchOrders", param);
    }

    public List<Order> getAllOrders() {
        return sql.selectList(NS + "getAllOrders");
    }
}
