package com.example.demo.dao;

import com.example.demo.model.PurchaseHistory;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PurchaseHistoryDao {
    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.PurchaseHistoryMapper.";

    public int insert(PurchaseHistory ph) {
        return sqlSession.insert(NS + "insert", ph);
    }

    public PurchaseHistory getByNo(Long no) {
        return sqlSession.selectOne(NS + "getByNo", no);
    }

    public List<PurchaseHistory> getAllPurchaseHistory() {
        return sqlSession.selectList(NS + "getAllPurchaseHistory");
    }

    public List<PurchaseHistory> getByEmail(String email) {
        return sqlSession.selectList(NS + "getByEmail", email);
    }

    public int updateDelivery(Long no, String delivery) {
        PurchaseHistory ph = new PurchaseHistory();
        ph.setPh_no(no);
        ph.setPh_delivery(delivery);
        return sqlSession.update(NS + "updateDelivery", ph);
    }

    public int updatePayment(Long no, String payment) {
        PurchaseHistory ph = new PurchaseHistory();
        ph.setPh_no(no);
        ph.setPh_payment(payment);
        return sqlSession.update(NS + "updatePayment", ph);
    }

    public int deleteByNo(Long no) {
        return sqlSession.delete(NS + "deleteByNo", no);
    }
}
