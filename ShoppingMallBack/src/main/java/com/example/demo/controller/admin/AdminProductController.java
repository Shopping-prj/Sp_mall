package com.example.demo.controller.admin;
import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
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

    private final ProductService productService;

    /** 상품 등록 */
    @PostMapping
    public ResponseEntity<String> addProduct(@RequestBody Product product) {
        // req.p_productId 가 PK(문자열)인 구조. 없으면 내부에서 생성하도록 바꿔도 됨.
        productService.addProduct(product);
        return ResponseEntity.ok(product.getP_productId());
    }

    /** 상품 수정 */
    @PutMapping("/{productId}")
    public ResponseEntity<Void> update(@PathVariable String productId, @RequestBody Product req) {
        req.setP_productId(productId);
        productService.update(req);
        return ResponseEntity.noContent().build();
    }

    /** 상품 삭제 */
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

    /** 상품 단건 조회 (필요 시) */
    @GetMapping("/{productId}")
    public ResponseEntity<Product> detail(@PathVariable String productId) {
        Product p = productService.getById(productId); // 아래 서비스에 메서드 추가
        return ResponseEntity.ok(p);
    }
}