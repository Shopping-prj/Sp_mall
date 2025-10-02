package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dao.PaymentDao;
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
    private final PortOneClient portOneClient;

    /**
     * 카트 금액과 프론트 결제요청 금액 비교
     */
    @Transactional(readOnly = true)
    public boolean verifyAmount(String email, Long frontAmount) {
        Long dbTotal = cartDao.getTotalAmountByEmail(email);
        log.info("결제 검증: email={}, frontAmount={}, dbTotal={}", email, frontAmount, dbTotal);
        return frontAmount.equals(dbTotal);
    }

    /**
     * 결제정보 저장 (pending 상태)
     * ⚠️ 이때 imp_uid 는 아직 없을 수 있음 → merchant_uid 기반으로 저장
     */
    public void register(Payment payment) {
        paymentDao.insert(payment);
    }

    /**
     * imp_uid 기준 단건 조회
     */
    @Transactional(readOnly = true)
    public Payment getById(String payImpUid) {
        return paymentDao.getById(payImpUid);
    }

    /**
     * 전체 결제내역 조회
     */
    @Transactional(readOnly = true)
    public List<Payment> getAllPayment() {
        return paymentDao.getAllPayment();
    }

    /**
     * 결제 성공 업데이트
     */
    public void updateAfterSuccess(Payment payment) {
        paymentDao.updateAfterSuccess(payment);
    }

    /**
     * 결제 취소 업데이트
     */
    public void updateAfterCancel(Payment payment) {
        paymentDao.updateAfterCancel(payment);
    }

    /**
     * 결제 삭제
     */
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
