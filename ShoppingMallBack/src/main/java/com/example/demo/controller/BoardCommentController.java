package com.example.demo.controller;

import com.example.demo.model.BoardComment;
import com.example.demo.service.BoardCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board-comments")
@RequiredArgsConstructor
public class BoardCommentController {
    private final BoardCommentService service;

    @PostMapping
    public ResponseEntity<String> register(@RequestBody BoardComment req) {
        return ResponseEntity.ok(service.register(req));
    }

    @GetMapping("/{no}")
    public ResponseEntity<BoardComment> getByNo(@PathVariable String no) {
        return ResponseEntity.ok(service.getByNo(no));
    }

    @GetMapping("/board/{bNo}")
    public ResponseEntity<List<BoardComment>> getByBoardNo(@PathVariable String bNo) {
        return ResponseEntity.ok(service.getByBoardNo(bNo));
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> delete(@PathVariable String no) {
        service.delete(no);
        return ResponseEntity.noContent().build();
    }
}
