package com.example.demo.controller.user;

import com.example.demo.config.JwtUtil;
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
    private final JwtUtil jwtUtil;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<Long> register(@RequestBody Member pMember) {
        Long id = memberService.register(pMember);
        return ResponseEntity.ok(id);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member pMember) {
        try {
            Member member = memberService.login(pMember.getM_email(), pMember.getM_password());

            // ✅ 토큰 발급
            String token = jwtUtil.generateToken(member.getM_email(), member.getM_class());

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "token", token,
                            "member", member,
                            "role", member.getM_class()
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // 내 정보 조회 (토큰 기반)
    @GetMapping("/me")
    public ResponseEntity<Member> getMyInfo(@RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmailFromHeader(authHeader);
        Member member = memberService.getByEmail(email);
        return ResponseEntity.ok(member);
    }

    // 내 주소 변경 (토큰 기반)
    @PatchMapping("/me/address")
    public ResponseEntity<Void> updateAddress(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String address
    ) {
        String email = jwtUtil.extractEmailFromHeader(authHeader);
        memberService.updateAddressByEmail(email, address);
        return ResponseEntity.noContent().build();
    }

    // 비밀번호 변경 (토큰 기반)
    @PatchMapping("/me/password")
    public ResponseEntity<Void> updatePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String newPassword
    ) {
        String email = jwtUtil.extractEmailFromHeader(authHeader);
        memberService.updatePasswordByEmail(email, newPassword);
        return ResponseEntity.noContent().build();
    }

    // 회원 탈퇴 (토큰 기반)
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(@RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmailFromHeader(authHeader);
        memberService.deleteByEmail(email);
        return ResponseEntity.noContent().build();
    }
}
