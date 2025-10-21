package com.example.demo.controller.user;

import com.example.demo.config.JwtUtil;
import com.example.demo.model.Member;
import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

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
            String accessToken = jwtUtil.generateAccessToken(member.getM_email(), member.getM_class());
            String refreshToken = jwtUtil.generateRefreshToken(member.getM_email());

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "accessToken", accessToken,
                            "refreshToken", refreshToken,
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

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body){
        String refreshToken = body.get("refreshToken");

        // 1. refreshToken 유효성 검증
        if(refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Refresh Token이 유효하지 않습니다."));
        }

        // 2. refreshToken에서 이메일 추출
        String email = jwtUtil.getEmail(refreshToken);

        // 3. 회원 정보 조회
        Member member = memberService.getByEmail(email);
        if(member == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "회원이 존재하지 않습니다."));
        }

        // 4. 새 Access Token 발급
        String newAccessToken = jwtUtil.generateAccessToken(member.getM_email(), member.getM_class());

        return  ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken
        ));
    }

    @PostMapping("/verify-password")
    public ResponseEntity<Void> verifyPassword(
            @RequestBody Map<String, String> req,
            Principal principal) {

        String email = principal.getName();
        String inputPw = req.get("password");

        boolean isValid = memberService.checkPassword(email, inputPw);
        if (isValid) {
            return ResponseEntity.ok().build(); // ✅ 200 OK (비밀번호 일치)
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // ❌ 401 Unauthorized
        }
    }

}