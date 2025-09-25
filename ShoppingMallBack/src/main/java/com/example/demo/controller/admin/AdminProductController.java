package com.example.demo.controller.admin;

import com.example.demo.model.Product;
import com.example.demo.model.admin.AdminProduct;
import com.example.demo.service.ProductService;
import com.example.demo.service.admin.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 전용 상품 API
 * 엔드포인트: /api/admin/products
 * - POST   등록
 * - PUT    수정
 * - DELETE 삭제
 * - GET    목록/단건 조회
 * (권한 제어는 SecurityConfig 확장 후 @PreAuthorize로 별도 적용 가능)
 */
@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;
    private final ProductService productService; // 목록/삭제 재사용

    /** 상품 등록: 프론트에서 p_* 필드(JSON)로 보내면 AdminProduct에 바로 매핑 */
    @PostMapping
    public ResponseEntity<String> create(@RequestBody AdminProduct req) {
        adminProductService.insert(req);
        return ResponseEntity.ok(req.getP_productId());
    }

    /** 상품 수정 (ProductInfo가 p_* 필드로 PUT) */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable("id") String id,
                                       @RequestBody AdminProduct req) {
        req.setP_productId(id);
        adminProductService.update(req);
        return ResponseEntity.noContent().build();
    }

    /** 상품 삭제 (기존 서비스 재사용) */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> delete(@PathVariable String productId) {
        productService.delete(productId);
        return ResponseEntity.noContent().build();
    }

    /** 상품 목록 (간단 버전) */
    @GetMapping
    public ResponseEntity<List<Product>> list() {
        return ResponseEntity.ok(productService.getAll());
    }

    /** 단건 상세 */
    @GetMapping("/{id}")
    public ResponseEntity<AdminProduct> detail(@PathVariable("id") String id) {
        AdminProduct p = adminProductService.getDetail(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }

    /** 헬스체크 */
    @GetMapping("/ping")
    public String ping() { return "pong"; }
}
