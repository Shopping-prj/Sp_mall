package com.example.demo.service;

import com.example.demo.dao.PaymentDao;
import com.example.demo.model.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentDao paymentDao;

    public String register(Payment payment) {
        paymentDao.insert(payment);
        return payment.getPay_imp_uid();
    }

    @Transactional(readOnly = true)
    public Payment getById(String payImpUid) {
        return paymentDao.getById(payImpUid);
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayment() {
        return paymentDao.getAllPayment();
    }

    public void updateStatus(String payImpUid, String status) {
        paymentDao.updateStatus(payImpUid, status);
    }

    public void delete(String payImpUid) {
        paymentDao.deleteById(payImpUid);
    }
}
