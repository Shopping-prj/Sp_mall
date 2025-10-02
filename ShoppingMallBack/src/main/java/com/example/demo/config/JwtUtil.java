package com.example.demo.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "ThisIsASecretKeyForJwtTokenGenerationThisIsASecretKey";
    private static final long ACCESS_EXPIRATION_TIME = 1000 * 60 * 2; // 현재 1분 (테스트용)
    private static final long REFRESH_EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 14; // 14일

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // ✅ Access Token 발급
    public String generateAccessToken(String email, String m_class) {
        return Jwts.builder()
                .setSubject(email)                     // sub → 이메일
                .claim("role", "ROLE_" + m_class)      // role claim
                .setIssuedAt(new Date())               // 발급 시각
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_TIME)) // 만료 시각
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Refresh Token 발급
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("type", "refresh")              // refresh임을 명시
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ AccessToken 갱신 (Refresh 성공 시 호출)
    public String refreshAccessToken(String email, String m_class) {
        return generateAccessToken(email, m_class);   // 기존 로직 그대로 사용
    }

    // ✅ 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isTokenExpiringSoon(String token) {
        Claims claims = getClaims(token);
        long exp = claims.getExpiration().getTime();
        long now = System.currentTimeMillis();
        return (exp - now) < 60_000; // 60초 이하 남으면 true
    }

    // ✅ Authorization 헤더에서 "Bearer " 제거 후 이메일 추출
    public String extractEmailFromHeader(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new IllegalArgumentException("잘못된 Authorization 헤더 형식입니다.");
        }
        String token = header.substring(7);
        return getEmail(token);
    }

    // ✅ 이메일 추출
    public String getEmail(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ 권한 추출
    public String getRole(String token) {
        return (String) getClaims(token).get("role");
    }

    // ✅ Claims 추출
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}