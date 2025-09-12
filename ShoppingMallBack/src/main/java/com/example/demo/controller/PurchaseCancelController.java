package com.example.demo.controller;

import com.example.demo.model.PurchaseCancel;
import com.example.demo.service.PurchaseCancelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-cancels")
@RequiredArgsConstructor
public class PurchaseCancelController {
    private final PurchaseCancelService service;

    @PostMapping
    public ResponseEntity<String> register(@RequestBody PurchaseCancel req) {
        return ResponseEntity.ok(service.register(req));
    }

    @GetMapping("/{impUid}")
    public ResponseEntity<PurchaseCancel> getByImpUid(@PathVariable String impUid) {
        return ResponseEntity.ok(service.getByImpUid(impUid));
    }

    @GetMapping
    public ResponseEntity<List<PurchaseCancel>> getAllCancel() {
        return ResponseEntity.ok(service.getAllCancel());
    }

    @DeleteMapping("/{impUid}")
    public ResponseEntity<Void> delete(@PathVariable String impUid) {
        service.delete(impUid);
        return ResponseEntity.noContent().build();
    }
}
