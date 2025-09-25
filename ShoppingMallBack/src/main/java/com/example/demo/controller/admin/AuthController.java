package com.example.demo.controller.admin;

import com.example.demo.config.JwtUtil;
import com.example.demo.dao.MemberDao;
import com.example.demo.dao.admin.AdminMemberDao;
import com.example.demo.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping // ← 클래스 레벨 prefix 제거(없어도 됨). 있어도 됐지만 절대 경로를 쓰려면 빼두는 게 덜 헷갈림
@RequiredArgsConstructor
public class AuthController {
    private final AdminMemberDao memberDao;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwt;



    // 네가 만든 경로도 유지: /api/auth/login
    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        return doLogin(req);
    }

    private ResponseEntity<?> doLogin(Map<String, String> req) {
        String email = req.get("m_email");
        String pw    = req.get("m_password");

        Member m = memberDao.getByEmailExact(email);
        if (m == null || !encoder.matches(pw, m.getM_password())) {
            return ResponseEntity.status(401).body(Map.of("ok", false, "error", "bad_credentials"));
        }

        String token = jwt.generate(m.getM_email(), m.getM_class());
        // 프론트에서 m_email도 필요하니 같이 내려줌
        return ResponseEntity.ok(Map.of(
                "ok", true,
                "token", token,
                "role", m.getM_class(),
                "m_email", m.getM_email()
        ));
    }

    // (선택) /api/auth/me
    @GetMapping("/api/auth/me")
    public ResponseEntity<?> me(@RequestHeader(value="Authorization", required=false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return ResponseEntity.status(401).body(Map.of("ok", false));
        var jws = jwt.parse(authHeader.substring(7));
        return ResponseEntity.ok(Map.of(
                "email", jws.getBody().getSubject(),
                "role", jws.getBody().get("role")
        ));
    }
}