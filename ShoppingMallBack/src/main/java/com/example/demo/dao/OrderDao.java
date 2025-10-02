package com.example.demo.dao;

import com.example.demo.model.CartItem;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class OrderDao {
    private static final String NS = "com.example.demo.dao.OrderMapper.";
    private final SqlSessionTemplate sql;

    public void insertOrder(Order order) {
        sql.insert(NS + "insertOrder", order);
    }

    public void insertOrderItem(OrderItem item) {
        sql.insert(NS + "insertOrderItem", item);
    }

    public List<CartItem> getCartItemsByCartNo(Long c_no) {
        return sql.selectList(NS + "getCartItemsByCartNo", c_no);
    }

    public void clearCartByCartNo(Long c_no) {
        sql.delete(NS + "clearCartByCartNo", c_no);
    }
}
