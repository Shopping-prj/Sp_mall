package com.example.demo.controller;

import com.example.demo.model.Member;
import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserMemberController {

    private final MemberService memberService;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<Long> register(@RequestBody Member req) {
        Long id = memberService.register(req);
        return ResponseEntity.ok(id);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member req) {
        try {
            Member m = memberService.login(req.getM_email(), req.getM_password());
            return ResponseEntity.ok(m);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // 내 정보 조회 (id 기반)
    @GetMapping("/{id}")
    public ResponseEntity<Member> getById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getById(id));
    }

    // 내 정보 조회 (email 기반)
    @GetMapping
    public ResponseEntity<Member> getByEmail(@RequestParam(required = false) String email) {
        if (email != null) {
            return ResponseEntity.ok(memberService.getByEmail(email));
        }
        return ResponseEntity.badRequest().build();
    }

    // 내 주소 변경
    @PatchMapping("/{id}/address")
    public ResponseEntity<Void> updateAddress(@PathVariable Long id, @RequestBody String address) {
        memberService.updateAddress(id, address);
        return ResponseEntity.noContent().build();
    }
}
