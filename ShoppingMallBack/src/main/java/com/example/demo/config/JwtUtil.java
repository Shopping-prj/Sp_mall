package com.example.demo.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "ThisIsASecretKeyForJwtTokenGenerationThisIsASecretKey"; // 256bit 이상
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1시간

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 토큰 생성 (이메일 + 회원등급 저장)
    public String generateToken(String email, String m_class) {
        return Jwts.builder()
                .setSubject(email)             // sub = 회원 이메일
                .claim("role", m_class)           // m_class(USER/ADMIN)
                .setIssuedAt(new Date())       // iat
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // exp
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 이메일 추출
    public String getEmail(String token) {
        return getClaims(token).getSubject();
    }

    // 권한 추출
    public String getRole(String token) {
        return (String) getClaims(token).get("role");
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Authorization 헤더에서 "Bearer " 제거 후 이메일 추출
    public String extractEmailFromHeader(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new IllegalArgumentException("잘못된 Authorization 헤더 형식입니다.");
        }
        String token = header.substring(7); // "Bearer " 이후 부분 추출
        return getEmail(token);
    }

    // ✅ Authorization 헤더에서 "Bearer " 제거 후 role 추출
    public String extractRoleFromHeader(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new IllegalArgumentException("잘못된 Authorization 헤더 형식입니다.");
        }
        String token = header.substring(7);
        return getRole(token);
    }

}
