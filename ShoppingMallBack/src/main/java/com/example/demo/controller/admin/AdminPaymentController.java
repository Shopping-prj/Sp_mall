package com.example.demo.controller.admin;

import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final PaymentService service;

    /** 전체 결제 조회 */
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(service.getAllPayments());
    }

    /** 결제 상태 갱신 */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updatePaymentStatus(
            @PathVariable("id") String payImpUid,
            @RequestParam String status
    ) {
        service.updateStatus(payImpUid, status);
        return ResponseEntity.noContent().build();
    }

    /** 결제 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable("id") String payImpUid) {
        service.delete(payImpUid);
        return ResponseEntity.noContent().build();
    }
}
