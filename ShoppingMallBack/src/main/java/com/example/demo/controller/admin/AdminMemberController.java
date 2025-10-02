package com.example.demo.controller.admin;

import com.example.demo.model.Member;
import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminMemberController
 * -----------------------------------------------------
 * 관리자 전용 회원 관리 컨트롤러 (검색 조건 반영)
 * -----------------------------------------------------
 */
@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final MemberService memberService;

    /**
     * 검색/조회
     * - keywordType: email | name
     * - keyword: 검색어
     * - cls: USER | ADMIN | ALL
     * - social: LOCAL | KAKAO | NAVER | GOOGLE | ALL
     * - from, to: 가입일자 (yyyy-MM-dd)
     */
    @GetMapping
    public ResponseEntity<List<Member>> searchMembers(
            @RequestParam(required = false) String keywordType,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "ALL") String cls,
            @RequestParam(required = false, defaultValue = "ALL") String social,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        return ResponseEntity.ok(
                memberService.search(keywordType, keyword, cls, social, from, to)
        );
    }

    /**
     * 특정 회원 단건 조회 (email 기반)
     */
    @GetMapping("/{email}")
    public ResponseEntity<Member> getMemberByEmail(@PathVariable String email) {
        return ResponseEntity.ok(memberService.getByEmail(email));
    }

    /**
     * 주소 수정
     */
    @PatchMapping("/{email}")
    public ResponseEntity<Void> updateMember(@PathVariable String email, @RequestBody Member updated) {
        memberService.updateAddressByEmail(email, updated.getM_address());
        return ResponseEntity.noContent().build();
    }

    /**
     * 삭제
     */
    @DeleteMapping("/{email}")
    public ResponseEntity<Void> delete(@PathVariable String email) {
        memberService.deleteByEmail(email);
        return ResponseEntity.noContent().build();
    }

    /**
     * 관리자 직접 추가
     */
    @PostMapping("/add")
    public ResponseEntity<Long> addMember(@RequestBody Member req) {
        Long id = memberService.register(req);
        return ResponseEntity.ok(id);
    }
}
