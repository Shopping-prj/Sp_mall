package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dao.OrderDao;
import com.example.demo.dao.PaymentDao;
import com.example.demo.model.Order;
import com.example.demo.model.Payment;
import com.example.demo.portone.PortOneClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 결제 비즈니스 로직
 * - 금액 검증
 * - 결제정보 저장/조회/수정/삭제
 * - PortOne API 연동 (상세조회 → DB 업데이트)
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentDao paymentDao;
    private final CartDao cartDao;
    private final OrderDao orderDao; // ✅ 주문 DAO 주입
    private final PortOneClient portOneClient;

    /**
     * 결제 금액 검증
     */
    @Transactional(readOnly = true)
    public boolean verifyAmount(String email, Long frontAmount) {
        Long dbTotal = cartDao.getTotalAmountByEmail(email);
        log.info("결제 검증: email={}, frontAmount={}, dbTotal={}", email, frontAmount, dbTotal);
        return frontAmount.equals(dbTotal);
    }

    /**
     * 결제정보 등록 (READY)
     */
    public void register(Payment payment) {
        paymentDao.insert(payment);
    }

    /**
     * 결제 성공 처리
     */
    public void updateAfterSuccess(Payment payment) {
        // ✅ 1. 결제 테이블 상태 업데이트
        paymentDao.updateAfterSuccess(payment);

        // ✅ 2. 주문 테이블에 연동 (없으면 생성)
        Order order = new Order();
        order.setO_email(payment.getPay_email());
        order.setO_merchant_uid(payment.getPay_merchant_uid());
        order.setO_amount(payment.getPay_amount());
        order.setO_address(payment.getPay_address());
        order.setO_status("결제완료"); // ✅ 상태 설정
        orderDao.insertOrder(order);

        log.info("✅ 주문 생성 완료: {}", order.getO_merchant_uid());
    }

    /**
     * 결제 취소 처리
     */
    public void updateAfterCancel(Payment payment) {
        // ✅ 1. 결제 상태 업데이트
        paymentDao.updateAfterCancel(payment);

        // ✅ 2. 관련 주문이 존재하면 상태를 '취소'로 변경
        orderDao.updateStatusByMerchantUid(payment.getPay_merchant_uid(), "취소");

        log.info("🚫 결제취소 처리 완료 (merchant_uid={})", payment.getPay_merchant_uid());
    }

    /**
     * 전체 조회 등 기존 코드 그대로 유지
     */
    @Transactional(readOnly = true)
    public Payment getById(String payImpUid) {
        return paymentDao.getById(payImpUid);
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayment() {
        return paymentDao.getAllPayment();
    }

    public void delete(String payImpUid) {
        paymentDao.deleteById(payImpUid);
    }

    /**
     * PortOne REST API 호출 → DB 업데이트 → 최신 Payment 반환
     */
    public Payment fetchAndUpdatePaymentDetail(String impUid) {
        // DB에 저장된 결제내역 조회
        Payment payment = paymentDao.getById(impUid);
        if (payment == null) return null;

        try {
            // PortOne REST API 토큰 발급
            String token = portOneClient.getAccessToken();

            // PortOne 결제 상세 조회
            Payment updated = portOneClient.getPaymentDetail(token, impUid);
            // DB 업데이트
            paymentDao.updateAfterSuccess(updated);
            // 최신값 반환
            return paymentDao.getById(impUid);
        } catch (Exception e) {
            log.error("PortOne 상세조회 실패: {}", e.getMessage(), e);
            return payment; // 실패 시 DB 값만 반환
        }
    }
}
