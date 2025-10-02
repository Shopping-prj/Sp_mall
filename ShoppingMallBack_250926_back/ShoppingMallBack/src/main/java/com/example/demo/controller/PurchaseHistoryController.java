package com.example.demo.controller;

import com.example.demo.model.PurchaseHistory;
import com.example.demo.service.PurchaseHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-history")
@RequiredArgsConstructor
public class PurchaseHistoryController {

    private final PurchaseHistoryService service;

    @PostMapping
    public ResponseEntity<Long> register(@RequestBody PurchaseHistory req) {
        return ResponseEntity.ok(service.register(req));
    }

    @GetMapping("/{no}")
    public ResponseEntity<PurchaseHistory> getByNo(@PathVariable Long no) {
        return ResponseEntity.ok(service.getByNo(no));
    }

    @GetMapping
    public ResponseEntity<List<PurchaseHistory>> getAllPurchaseHistory() {
        return ResponseEntity.ok(service.getAllPurchaseHistory());
    }

    @GetMapping("/member/{email}")
    public ResponseEntity<List<PurchaseHistory>> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.getByEmail(email));
    }

    @PatchMapping("/{no}/delivery")
    public ResponseEntity<Void> updateDelivery(@PathVariable Long no, @RequestBody String delivery) {
        service.updateDelivery(no, delivery);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{no}/payment")
    public ResponseEntity<Void> updatePayment(@PathVariable Long no, @RequestBody String payment) {
        service.updatePayment(no, payment);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> delete(@PathVariable Long no) {
        service.delete(no);
        return ResponseEntity.noContent().build();
    }
}
