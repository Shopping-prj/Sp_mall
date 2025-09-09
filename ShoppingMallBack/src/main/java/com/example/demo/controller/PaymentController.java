package com.example.demo.controller;

import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;
    // 결제 요청(Insert)
    // DB에 결제 시도 기록을 남김 (imp_uid, amount, user_id, status=pending)
    @PostMapping
    public ResponseEntity<String> requestPayment(@RequestBody Payment req) {
        return ResponseEntity.ok(service.requestPayment(req));
    }

    // 결제 단건 조회(Select by id)
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable("id") String payImpUid) {
        return ResponseEntity.ok(service.getPayment(payImpUid));
    }
    // 결제 전체 조회(Select all)
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(service.getAllPayments());
    }
    // 결제 상태 갱신(Update)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updatePaymentStatus(@PathVariable("id") String payImpUid,
                                                    @RequestParam String status) {
        service.updateStatus(payImpUid, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable("id") String payImpUid) {
        service.delete(payImpUid);
        return ResponseEntity.noContent().build();
    }
}
