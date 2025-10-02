package com.example.demo.dao.admin;

import com.example.demo.model.admin.AdminOrder;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AdminOrderDao {

    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.admin.AdminOrderMapper.";

    public List<AdminOrder> adminSearch(Map<String,Object> param) {
        return sqlSession.selectList(NS + "adminSearch", param);
    }

    public long adminSearchCount(Map<String,Object> param) {
        Long c = sqlSession.selectOne(NS + "adminSearchCount", param);
        return c == null ? 0L : c;
    }

    public int adminUpdateStatus(Long phNo, String status) {
        Map<String,Object> p = new HashMap<>();
        p.put("phNo", phNo);
        p.put("status", status);
        return sqlSession.update(NS + "adminUpdateStatus", p);
    }

    public int adminUpsertShipment(Long phNo, String courier, String invoiceNo) {
        Map<String,Object> p = new HashMap<>();
        p.put("phNo", phNo);
        p.put("courier", courier);
        p.put("invoiceNo", invoiceNo);
        return sqlSession.update(NS + "adminUpsertShipment", p);
    }
}