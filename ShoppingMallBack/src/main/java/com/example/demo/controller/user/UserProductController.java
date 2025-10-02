package com.example.demo.controller.user;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class UserProductController {

    private final ProductService service;

    /** 전체 상품 조회 */
    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    /** 특정 상품 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /** 카테고리별 상품 조회 */
    @GetMapping("/categories")
    public ResponseEntity<List<Product>> getByCategories(@RequestParam String category) {
        return ResponseEntity.ok(service.getByCategories(category));
    }

    /** 키워드 검색 */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(service.search(keyword));
    }
}
