package com.example.demo.controller.admin;

import com.example.demo.model.admin.AdminBoard;
import com.example.demo.service.admin.AdminBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/boards")
@RequiredArgsConstructor
public class AdminBoardController {
    private final AdminBoardService service;

    @GetMapping
    public List<AdminBoard> list() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<AdminBoard> detail(@PathVariable Long id) {
        AdminBoard b = service.getDetail(id);
        return (b == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(b);
    }

    @PostMapping(consumes="application/json")
    public ResponseEntity<Long> create(@RequestBody AdminBoard req) {
        service.insert(req);
        return ResponseEntity.ok(req.getB_no());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody AdminBoard req) {
        req.setB_no(id);
        service.update(req);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}