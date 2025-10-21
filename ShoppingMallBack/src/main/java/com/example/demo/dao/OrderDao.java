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

    public Map<String, Object> getOrderSummary() {
        return sql.selectOne(NS + "getOrderSummary");
    }

    public List<Order> getRecentOrders() {
        return sql.selectList(NS + "getRecentOrders");
    }

    // ✅ 주문 생성 (결제 완료 시)
    public int insertOrder(Order order) {
        return sql.insert(NS + "insertOrder", order);
    }

    // ✅ 주문 상태 변경 (결제 취소 시)
    public int updateStatusByMerchantUid(String merchantUid, String status) {
        Map<String, Object> param = Map.of(
                "merchantUid", merchantUid,
                "status", status
        );
        return sql.update(NS + "updateStatusByMerchantUid", param);
    }
}
