package com.example.demo.controller.admin;

import com.example.demo.model.admin.AdminBoardComment;
import com.example.demo.service.admin.AdminBoardCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/admin/comments")
@RequiredArgsConstructor
public class AdminBoardCommentController {
    private final AdminBoardCommentService service;

    // 게시글별 댓글 목록
    @GetMapping("/board/{b_no}")
    public List<AdminBoardComment> listByBoard(@PathVariable Long b_no) {
        return service.getByBoard(b_no);
    }

    @GetMapping("/{bc_no}")
    public ResponseEntity<AdminBoardComment> detail(@PathVariable Long bc_no) {
        AdminBoardComment c = service.getDetail(bc_no);
        return (c == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(c);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<Long> create(@RequestBody AdminBoardComment req) {
        // 간단 검증(들어오는 값이 없으면 400)
        if (req.getBc_email() == null || req.getBc_email().isBlank()) {
            return ResponseEntity.badRequest().body(null);
        }
        service.insert(req);
        return ResponseEntity.created(URI.create("/api/admin/comments/" + req.getBc_no()))
                .body(req.getBc_no());
    }

    @PutMapping("/{bc_no}")
    public ResponseEntity<Void> update(@PathVariable Long bc_no, @RequestBody AdminBoardComment req) {
        req.setBc_no(bc_no);
        service.update(req);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{bc_no}")
    public ResponseEntity<Void> delete(@PathVariable Long bc_no) {
        service.delete(bc_no);
        return ResponseEntity.noContent().build();
    }
}
