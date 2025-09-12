package com.example.demo.controller.admin;

import com.example.demo.model.admin.AdminBoard;
import com.example.demo.service.admin.AdminBoardService;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/boards")
@RequiredArgsConstructor
public class AdminBoardController {

    private final AdminBoardService adminBoardService;

    @PostMapping
    public ResponseEntity<String> create(@RequestBody AdminBoard req) {
        String id = adminBoardService.create(req);
        return ResponseEntity.ok(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable String id, @RequestBody AdminBoard req) {
        adminBoardService.update(id, req);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminBoard> detail(@PathVariable String id,
                                             @RequestParam(defaultValue = "false") boolean inc) {
        return ResponseEntity.ok(adminBoardService.detail(id, inc));
    }

    @GetMapping
    public ResponseEntity<PageDto> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean pinned,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<AdminBoard> content = adminBoardService.list(keyword, status, pinned, page, size);
        long totalCount = adminBoardService.count(keyword, status, pinned);
        return ResponseEntity.ok(new PageDto(content, totalCount, page, size));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        adminBoardService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Getter @AllArgsConstructor
    static class PageDto {
        private List<AdminBoard> content;
        private long totalCount;
        private int page;
        private int size;
    }
}