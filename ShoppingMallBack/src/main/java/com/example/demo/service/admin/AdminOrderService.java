package com.example.demo.service.admin;

import com.example.demo.dao.admin.AdminOrderDao;
import com.example.demo.model.admin.AdminOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final AdminOrderDao adminOrderDao;

    /** 주문 목록/검색 */
    public List<AdminOrder> search(String keywordType, String keyword,
                                   String status, String rex, Integer any,
                                   String from, String to,
                                   String payMethod, String courier,
                                   Integer limit, Integer offset) {
        Map<String,Object> p = new HashMap<>();
        p.put("kwType", keywordType);
        p.put("kw", keyword);
        p.put("status", status);
        p.put("rex", rex);
        p.put("any", any != null && any == 1 ? 1 : 0);
        p.put("from", from);
        p.put("to", to);
        p.put("payMethod", payMethod);
        p.put("courier", courier);
        p.put("limit", limit);
        p.put("offset", offset);
        return adminOrderDao.adminSearch(p);
    }

    /** 건수 */
    public long count(String keywordType, String keyword,
                      String status, String rex, Integer any,
                      String from, String to,
                      String payMethod, String courier) {
        Map<String,Object> p = new HashMap<>();
        p.put("kwType", keywordType);
        p.put("kw", keyword);
        p.put("status", status);
        p.put("rex", rex);
        p.put("any", any != null && any == 1 ? 1 : 0);
        p.put("from", from);
        p.put("to", to);
        p.put("payMethod", payMethod);
        p.put("courier", courier);
        return adminOrderDao.adminSearchCount(p);
    }

    /** 상태 변경 */
    public boolean updateStatus(Long phNo, String status) {
        return adminOrderDao.adminUpdateStatus(phNo, status) > 0;
    }

    /** 송장 저장/수정 */
    public boolean upsertShipment(Long phNo, String courier, String invoiceNo) {
        return adminOrderDao.adminUpsertShipment(phNo, courier, invoiceNo) > 0;
    }
}