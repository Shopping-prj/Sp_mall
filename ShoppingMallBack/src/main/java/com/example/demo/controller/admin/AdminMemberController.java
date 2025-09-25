package com.example.demo.controller;

import com.example.demo.model.Member;
import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final MemberService memberService;

    // 전체 회원 조회
    @GetMapping
    public ResponseEntity<List<Member>> getAllMember() {
        return ResponseEntity.ok(memberService.getAll());
    }

    // 특정 회원 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getById(id));
    }

    // 회원 정보 수정 (예: 주소나 권한 변경)
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateMember(@PathVariable Long id, @RequestBody Member updated) {
        // 여기서 memberService.updateAddress(...) 뿐만 아니라
        // 필요하면 updateRole, updatePassword 같은 것도 확장 가능
        memberService.updateAddress(id, updated.getM_address());
        return ResponseEntity.noContent().build();
    }

    // 회원 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // (선택) 관리자에 의한 회원 강제 등록
    @PostMapping("/add")
    public ResponseEntity<Long> addMember(@RequestBody Member req) {
        Long id = memberService.register(req);
        return ResponseEntity.ok(id);
    }
}
