package com.example.demo.controller.admin;

import com.example.demo.model.Member;
import com.example.demo.model.admin.AdminMember;
import com.example.demo.service.admin.AdminMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    /** 목록/검색 (기존) */
    @GetMapping
    public ResponseEntity<List<Member>> list(
            @RequestParam(required = false, defaultValue = "email") String keywordType,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "ALL") String cls,
            @RequestParam(required = false, defaultValue = "ALL") String social,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset
    ) {
        return ResponseEntity.ok(
                adminMemberService.search(keywordType, keyword, cls, social, from, to, limit, offset)
        );
    }

    // 이메일 정확 일치 단건 조회
    @GetMapping("/by-email")
    public ResponseEntity<Member> byEmail(@RequestParam String email) {
        var m = adminMemberService.getByEmailExact(email);
        if (m == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(m);
    }

    /** ✅ 수정 */
    @PutMapping("/{mNo}")
    public ResponseEntity<Void> update(@PathVariable("mNo") Long mNo,
                                       @RequestBody AdminMember req) {
        boolean ok = adminMemberService.update(mNo, req);
        if (!ok) return ResponseEntity.notFound().build(); // 대상 없음
        return ResponseEntity.noContent().build();
    }

    /** 회원 등록 */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody AdminMember member) {
        adminMemberService.register(member);
        return ResponseEntity.ok().body("회원 등록 성공");
    }

    // ✅ 회원 삭제
    @DeleteMapping("/{mNo}")
    public ResponseEntity<?> delete(@PathVariable("mNo") Long mNo) {
        boolean ok = adminMemberService.delete(mNo);
        if (!ok) {
            return ResponseEntity.notFound().build(); // 삭제할 회원 없음
        }
        return ResponseEntity.ok("회원이 삭제되었습니다.");
    }


}