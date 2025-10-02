package com.example.demo.controller.user;

import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class UserPaymentController {

    private final PaymentService service;

    // (1) 결제 전 금액 검증
    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestBody Map<String, Object> req) {
        String email = (String) req.get("pay_email");
        Long frontAmount = asLong(req.get("pay_amount"));
        if (email == null || frontAmount == null) {
            return ResponseEntity.badRequest().body("검증 파라미터 오류");
        }

        boolean valid = service.verifyAmount(email, frontAmount);
        if (!valid) return ResponseEntity.badRequest().body("금액 불일치");
        return ResponseEntity.ok("검증 성공");
    }

    // (2) 결제 성공 콜백
    @PostMapping("/callback/success")
    public ResponseEntity<String> success(@RequestBody Payment payment) {
        log.info("✅ 결제 성공 callback payment={}", payment);

        // paid_at_unix → LocalDateTime 변환
        if (payment.getPaid_at_unix() != null) {
            payment.setPay_paid_at(
                    LocalDateTime.ofInstant(
                            Instant.ofEpochSecond(payment.getPaid_at_unix()),
                            ZoneId.systemDefault()
                    )
            );
        } else {
            payment.setPay_paid_at(LocalDateTime.now());
        }

        // 상태값 보정
        if (payment.getPay_status() == null) {
            payment.setPay_status("paid");
        }

        service.register(payment);
        return ResponseEntity.ok("결제 완료");
    }

    // (3) 결제 취소 콜백
    @PostMapping("/callback/cancel")
    public ResponseEntity<String> cancel(@RequestBody Payment payment) {
        log.info("결제 취소 콜백 payment={}", payment);
        service.updateStatus(payment.getPay_imp_uid(), "cancelled");
        return ResponseEntity.ok("결제 취소");
    }

    // (4) 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getById(@PathVariable("id") String payImpUid) {
        return ResponseEntity.ok(service.getById(payImpUid));
    }

    // (5) 전체 조회
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayment() {
        return ResponseEntity.ok(service.getAllPayment());
    }

    // ====== util ======
    private Long asLong(Object o) {
        if (o == null) return null;
        if (o instanceof Number n) return n.longValue();
        try { return Long.parseLong(o.toString()); } catch (Exception e) { return null; }
    }
}
