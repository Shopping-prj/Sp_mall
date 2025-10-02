package com.example.demo.controller.admin;

import com.example.demo.model.admin.AdminOrder;
import com.example.demo.service.admin.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    /** 목록/검색 */
    @GetMapping
    public ResponseEntity<Map<String,Object>> list(
            @RequestParam(required = false, defaultValue = "ph_no") String keywordType,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String rex,
            @RequestParam(required = false) Integer any,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String payMethod,
            @RequestParam(required = false) String courier,
            @RequestParam(required = false, defaultValue = "30") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer offset
    ) {
        List<AdminOrder> items = adminOrderService.search(
                keywordType, keyword, status, rex, any, from, to, payMethod, courier, limit, offset
        );
        long total = adminOrderService.count(
                keywordType, keyword, status, rex, any, from, to, payMethod, courier
        );
        return ResponseEntity.ok(Map.of("items", items, "total", total));
    }

    /** 상태 변경 */
    @PutMapping("/{phNo}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Long phNo,
                                          @RequestBody Map<String,String> body) {
        boolean ok = adminOrderService.updateStatus(phNo, body.get("status"));
        if (!ok) return ResponseEntity.notFound().build();
        return ResponseEntity.ok().body("상태 변경 성공");
    }

    /** 송장 저장 */
    @PutMapping("/{phNo}/shipment")
    public ResponseEntity<?> saveShipment(@PathVariable Long phNo,
                                          @RequestBody Map<String,String> body) {
        boolean ok = adminOrderService.upsertShipment(phNo, body.get("courier"), body.get("invoiceNo"));
        if (!ok) return ResponseEntity.badRequest().body("송장 저장 실패");
        return ResponseEntity.ok("송장 저장 성공");
    }
}