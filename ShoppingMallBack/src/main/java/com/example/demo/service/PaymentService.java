package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dao.PaymentDao;
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

    private final PaymentDao paymentDao; // 결제 테이블 DAO
    private final CartDao cartDao;       // 장바구니 테이블 DAO

    /**
     * ✅ 결제 검증 로직
     * 프론트에서 넘어온 금액(frontAmount)과
     * DB 장바구니 총합 금액(dbTotal)을 비교한다.
     *
     * @param email 사용자의 이메일
     * @param frontAmount 프론트에서 전달받은 결제 금액
     * @return 두 금액이 같으면 true, 다르면 false
     */
    @Transactional(readOnly = true)
    public boolean verifyAmount(String email, Long frontAmount) {
        Long dbTotal = cartDao.getTotalAmountByEmail(email);
        // 👇 로깅
        log.info("결제 금액 검증: email={}, frontAmount={}, dbTotal={}",
                email, frontAmount, dbTotal);
        return frontAmount.equals(dbTotal);
    }

    /**
     * ✅ 결제 정보 저장
     * PG사 결제가 완료(status=paid)된 후 호출되는 메소드.
     * 결제 정보를 payment 테이블에 insert 한다.
     *
     * @param payment PG사로부터 전달된 결제 정보
     * @return 저장된 결제의 imp_uid (포트원 결제 고유번호)
     */
    public String register(Payment payment) {
        paymentDao.insert(payment);
        return payment.getPay_imp_uid();
    }

    /**
     * 특정 결제 조회
     * @param payImpUid imp_uid (결제 고유번호)
     * @return Payment 객체
     */
    @Transactional(readOnly = true)
    public Payment getById(String payImpUid) {
        return paymentDao.getById(payImpUid);
    }

    /**
     * 전체 결제 내역 조회
     * @return Payment 리스트
     */
    @Transactional(readOnly = true)
    public List<Payment> getAllPayment() {
        return paymentDao.getAllPayment();
    }

    /**
     * 결제 상태 업데이트
     * (예: cancel, refunded 등)
     *
     * @param payImpUid imp_uid (결제 고유번호)
     * @param status 변경할 상태 값
     */
    public void updateStatus(String payImpUid, String status) {
        paymentDao.updateStatus(payImpUid, status);
    }

    /**
     * 특정 결제 내역 삭제
     * @param payImpUid imp_uid (결제 고유번호)
     */
    public void delete(String payImpUid) {
        paymentDao.deleteById(payImpUid);
    }
}
