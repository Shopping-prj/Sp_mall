package com.example.demo.controller.user;

import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class UserPaymentController {

    private final PaymentService service;

    // ✅ (1) 결제 전 검증
    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestBody Map<String, Object> req) {
        String email = (String) req.get("pay_email");
        Long frontAmount = Long.valueOf(req.get("pay_amount").toString());

        boolean valid = service.verifyAmount(email, frontAmount);
        if (!valid) {
            return ResponseEntity.badRequest().body("금액 불일치");
        }
        return ResponseEntity.ok("검증 성공");
    }

    // ✅ (2) 포트원 콜백 - 성공
    @PostMapping("/callback/success")
    public ResponseEntity<String> success(@RequestBody Payment payment) {
        if (!"paid".equals(payment.getPay_status())) {
            return ResponseEntity.badRequest().body("결제가 완료되지 않았습니다.");
        }
        service.register(payment); // 이제 DB insert
        return ResponseEntity.ok("결제 완료");
    }

    // ✅ (3) 포트원 콜백 - 취소
    @PostMapping("/callback/cancel")
    public ResponseEntity<String> cancel(@RequestBody Payment payment) {
        service.updateStatus(payment.getPay_imp_uid(), "cancelled");
        return ResponseEntity.ok("결제 취소");
    }

    // ✅ 조회 API들
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getById(@PathVariable("id") String payImpUid) {
        return ResponseEntity.ok(service.getById(payImpUid));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayment() {
        return ResponseEntity.ok(service.getAllPayment());
    }
}
