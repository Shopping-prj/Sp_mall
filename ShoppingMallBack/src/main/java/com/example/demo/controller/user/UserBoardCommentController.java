package com.example.demo.controller.user;

import com.example.demo.model.BoardComment;
import com.example.demo.service.BoardCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/board-comments")
@RequiredArgsConstructor
public class UserBoardCommentController {

    private final BoardCommentService service;

    // 댓글 등록
    @PostMapping
    public ResponseEntity<String> register(@RequestBody BoardComment req) {
        return ResponseEntity.ok(service.register(req));
    }

    // 댓글 단건 조회
    @GetMapping("/{no}")
    public ResponseEntity<BoardComment> getByNo(@PathVariable String no) {
        return ResponseEntity.ok(service.getByNo(no));
    }

    // 특정 게시글의 댓글 목록 조회
    @GetMapping("/board/{bNo}")
    public ResponseEntity<List<BoardComment>> getByBoardNo(@PathVariable String bNo) {
        return ResponseEntity.ok(service.getByBoardNo(bNo));
    }

    // 내 댓글 삭제
    @DeleteMapping("/{no}")
    public ResponseEntity<Void> delete(@PathVariable String no) {
        service.delete(no);
        return ResponseEntity.noContent().build();
    }
}
