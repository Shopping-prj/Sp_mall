package com.example.demo.controller;

import com.example.demo.model.Board;
import com.example.demo.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService service;

    @PostMapping
    public ResponseEntity<String> register(@RequestBody Board req) {
        return ResponseEntity.ok(service.register(req));
    }

    @GetMapping("/{no}")
    public ResponseEntity<Board> getByNo(@PathVariable String no) {
        return ResponseEntity.ok(service.getByNo(no));
    }

    @GetMapping
    public ResponseEntity<List<Board>> getAllBoard() {
        return ResponseEntity.ok(service.getAllBoard());
    }

    @PutMapping("/{no}")
    public ResponseEntity<Void> update(@PathVariable String no, @RequestBody Board req) {
        req.setB_no(no);
        service.update(req);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> delete(@PathVariable String no) {
        service.delete(no);
        return ResponseEntity.noContent().build();
    }
}
