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

    @PostMapping
    public ResponseEntity<String> register(@RequestBody Payment req) {
        return ResponseEntity.ok(service.register(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getById(@PathVariable("id") String payImpUid) {
        return ResponseEntity.ok(service.getById(payImpUid));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayment() {
        return ResponseEntity.ok(service.getAllPayment());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable("id") String payImpUid,
                                             @RequestBody String status) {
        service.updateStatus(payImpUid, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String payImpUid) {
        service.delete(payImpUid);
        return ResponseEntity.noContent().build();
    }
}
