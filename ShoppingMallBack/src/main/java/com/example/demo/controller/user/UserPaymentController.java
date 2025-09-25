package com.example.demo.controller.user;

import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/payments")
@RequiredArgsConstructor
public class UserPaymentController {

    private final PaymentService service;

    /** 결제 요청 */
    @PostMapping
    public ResponseEntity<String> requestPayment(@RequestBody Payment req) {
        return ResponseEntity.ok(service.requestPayment(req));
    }

    /** 내 결제 단건 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable("id") String payImpUid) {
        return ResponseEntity.ok(service.getPayment(payImpUid));
    }

    /** 내 결제 전체 조회 */
    @GetMapping
    public ResponseEntity<List<Payment>> getMyPayments(@RequestParam String email) {
        return ResponseEntity.ok(service.getPaymentsByEmail(email));
    }
}
