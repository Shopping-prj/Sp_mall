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

    public String requestPayment(Payment payment) {
        paymentDao.insert(payment);
        return payment.getPay_imp_uid();
    }

    @Transactional(readOnly = true)
    public Payment getPayment(String payImpUid) {
        return paymentDao.getById(payImpUid);
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        return paymentDao.getAllPayments();
    }

    public void updateStatus(String payImpUid, String status) {
        paymentDao.updateStatus(payImpUid, status);
    }

    public void delete(String payImpUid) {
        paymentDao.deleteById(payImpUid);
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByEmail(String email) {
        return paymentDao.getByEmail(email);
    }
}
