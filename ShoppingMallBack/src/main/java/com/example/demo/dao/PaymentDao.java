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

    public List<Payment> getAllPayment() {
        return sqlSession.selectList(NS + "getAllPayment");
    }

    public int updateAfterSuccess(Payment payment) {
        return sqlSession.update(NS + "updateAfterSuccess", payment);
    }

    public int updateAfterCancel(Payment payment) {
        return sqlSession.update(NS + "updateAfterCancel", payment);
    }

    public int deleteById(String payImpUid) {
        return sqlSession.delete(NS + "deleteById", payImpUid);
    }
}
