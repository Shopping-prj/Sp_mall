package com.example.demo.dao;

import com.example.demo.dto.CartDTO;
import com.example.demo.dto.OrderItemDTO;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@Repository
@RequiredArgsConstructor
public class OrderDao {
    private static final String NS = "com.example.demo.dao.OrderMapper.";
    private final SqlSessionTemplate sql;

    // 1. 이메일로 OrderDTO 조회 (Order + Items)
    public List<OrderItemDTO> getOrderByEmail(String email) {
        log.info("getByEmail");
        return sql.selectList(NS + "getByEmail", email);
    }

    public List<OrderItemDTO> searchToOrder(Map<String, String> searchParams) {
        return sql.selectList(NS + "searchToOrder", searchParams);
    }
}
