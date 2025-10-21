package com.example.demo.controller.user;

import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 결제 컨트롤러 (회원 전용)
 * - 결제 검증 + pending 저장
 * - 콜백 성공/취소 처리
 * - impUid 기반 PortOne 상세조회
 */
@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class UserPaymentController {

    private final PaymentService service;

    /**
     * 1) 결제 전 검증 및 pending 저장
     * - 결제창 호출 전에 amount 검증 → DB insert (ready 상태)
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyAndRegister(@RequestBody Payment payment) {
        boolean valid = service.verifyAmount(payment.getPay_email(), payment.getPay_amount());
        if (!valid) {
            return ResponseEntity.badRequest().body("금액 불일치");
        }
        service.register(payment);
        return ResponseEntity.ok("결제 요청 저장 성공");
    }

    /**
     * 2) 결제 성공 콜백
     * - 프론트에서 받은 JSON을 Payment 객체에 매핑
     * - DB의 ready 상태 row를 paid로 업데이트
     */
    @PostMapping("/callback/success")
    public ResponseEntity<?> callbackSuccess(@RequestBody Payment payment) {
        service.updateAfterSuccess(payment);
        return ResponseEntity.ok("결제 성공 처리 완료");
    }

    /**
     * 3) 결제 취소 콜백
     * - 취소된 결제를 cancelled 상태로 업데이트
     */
    @PostMapping("/callback/cancel")
    public ResponseEntity<?> callbackCancel(@RequestBody Payment payment) {
        service.updateAfterCancel(payment);
        return ResponseEntity.ok("결제 취소 처리 완료");
    }

    /**
     * 4) 결제 상세 조회 (PortOne API 연동)
     * - impUid 기반으로 PortOne REST API 조회
     * - DB 값 보강 후 최신 상태 반환
     */
    @GetMapping("/{impUid}")
    public ResponseEntity<?> getPaymentDetail(@PathVariable String impUid) {
        try {
            Payment payment = service.fetchAndUpdatePaymentDetail(impUid);
            if (payment == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("결제 상세 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("결제 상세 조회 실패");
        }
    }
    /**
     * 5) 전체 결제내역 조회
     * - 관리자나 사용자용으로 전체 결제 목록 반환
     */
    @GetMapping("/search")
    public ResponseEntity<?> getAllPayment() {
        return ResponseEntity.ok(service.getAllPayment());
    }
}
