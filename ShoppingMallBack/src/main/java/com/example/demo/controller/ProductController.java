package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Product>> getByCategories(@RequestParam String category){
        return ResponseEntity.ok(service.getByCategories(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam String keyword){
        return ResponseEntity.ok(service.search(keyword));
    }


    ////////////////////////////////////////////////// 관리자 관련 코드 //////////////////////////////////////////////////
    @PostMapping
    public ResponseEntity<String> register(@RequestBody Product req) {
        return ResponseEntity.ok(service.register(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable String id, @RequestBody Product req) {
        req.setP_productId(id);
        service.update(req);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
