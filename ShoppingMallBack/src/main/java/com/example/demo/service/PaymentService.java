package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dao.PaymentDao;
import com.example.demo.dao.OrderDao;
import com.example.demo.model.CartItem;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentDao paymentDao;
    private final CartDao cartDao;
    private final OrderDao orderDao;

    /**
     * ✅ 결제 검증 (프론트 금액 vs DB 금액)
     */
    @Transactional(readOnly = true)
    public boolean verifyAmount(String email, Long frontAmount) {
        Long dbTotal = cartDao.getTotalAmountByEmail(email);
        log.info("결제 금액 검증: email={}, frontAmount={}, dbTotal={}",
                email, frontAmount, dbTotal);
        return frontAmount.equals(dbTotal);
    }

    /**
     * ✅ 결제 등록 + 주문 생성 + 장바구니 비우기
     */
    public String register(Payment payment) {
        // 1. 결제 저장
        paymentDao.insert(payment);

        // 2. 주문 생성
        Order order = new Order();
        order.setO_email(payment.getPay_email());
        order.setO_merchant_uid(payment.getPay_merchant_uid());
        order.setO_amount(payment.getPay_paid_amount() != null
                ? payment.getPay_paid_amount()
                : payment.getPay_amount());
        order.setO_address(payment.getPay_address());
        order.setO_status("배송준비");
        orderDao.insertOrder(order);  // o_no 자동생성됨

        // 3. 장바구니 비우기
        cartDao.clearByCartNo(payment.getC_no());

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
