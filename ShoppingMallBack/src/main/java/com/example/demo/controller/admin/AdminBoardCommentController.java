package com.example.demo.controller.admin;

import com.example.demo.service.BoardCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/boards")
@RequiredArgsConstructor
public class AdminBoardCommentController {

    private final BoardCommentService service;

    // 관리자 권한으로 댓글 삭제
    @DeleteMapping("/{no}")
    public ResponseEntity<Void> delete(@PathVariable String no) {
        service.delete(no);
        return ResponseEntity.noContent().build();
    }
}
