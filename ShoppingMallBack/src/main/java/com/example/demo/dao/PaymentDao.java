package com.example.demo.dao;

import com.example.demo.model.Payment;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PaymentDao {

    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.PaymentMapper.";

    public int insert(Payment payment) {
        return sqlSession.insert(NS + "insert", payment);
    }

    public Payment getById(String payImpUid) {
        return sqlSession.selectOne(NS + "getById", payImpUid);
    }

    public List<Payment> getAllPayments() {
        return sqlSession.selectList(NS + "getAllPayment");
    }

    public int updateStatus(String payImpUid, String status) {
        Payment param = new Payment();
        param.setPay_imp_uid(payImpUid);
        param.setPay_status(status);
        return sqlSession.update(NS + "updateStatus", param);
    }

    public int deleteById(String payImpUid) {
        return sqlSession.delete(NS + "deleteById", payImpUid);
    }
}
