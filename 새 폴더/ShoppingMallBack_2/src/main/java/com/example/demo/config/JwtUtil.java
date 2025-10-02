package com.example.demo.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "ThisIsASecretKeyForJwtTokenGenerationThisIsASecretKey"; // 256bit 이상
    private static final long ACCESS_EXPIRATION_TIME = 1000 * 60 * 60; // 1시간
    private static final long REFRESH_EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 14; // 14일

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // ✅ Access Token 발급
    public String generateAccessToken(String email, String m_class) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", m_class)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Refresh Token 발급
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("type", "refresh")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ 유효성 검증
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

    // ✅ Claims 추출 (공통)
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
        String token = header.substring(7);
        return getEmail(token);
    }
}

