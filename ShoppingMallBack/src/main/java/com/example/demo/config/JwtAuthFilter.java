package com.example.demo.config;

import com.example.demo.config.auth.PrincipalDetails;
import com.example.demo.model.Member;
import com.example.demo.service.MemberService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MemberService memberService;

    public JwtAuthFilter(JwtUtil jwtUtil, MemberService memberService) {
        this.jwtUtil = jwtUtil;
        this.memberService = memberService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ 토큰 검사에서 제외할 경로
        if (path.startsWith("/api/users/login") ||
                path.startsWith("/api/users/join") ||
                path.startsWith("/api/users/refresh") ||
                path.startsWith("/api/products")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 요청 헤더에서 Authorization 추출
        String authHeader = request.getHeader("Authorization");
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        try {
            if (token != null && jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmail(token);
                String role = jwtUtil.getRole(token);

                // ✅ DB에서 회원 정보 조회
                Member member = memberService.getByEmail(email);

                if (member != null && ("ROLE_" + member.getM_class()).equals(role)) {
                    // ✅ 인증 객체 생성 및 SecurityContext 등록
                    PrincipalDetails principalDetails = new PrincipalDetails(member);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    principalDetails,
                                    null,
                                    principalDetails.getAuthorities()
                            );
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // ✅ (추가) 만료 임박 시 AccessToken 재발급 — 단, 관리자 제외
                    if (jwtUtil.isTokenExpiringSoon(token)) {
                        if (!"ROLE_ADMIN".equals(role)) {   // 관리자 제외
                            String newAccessToken = jwtUtil.refreshAccessToken(email, member.getM_class());
                            response.setHeader("X-New-Access-Token", newAccessToken);
                        }
                    }

                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Token or Role");
                    return;
                }
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or Invalid Token");
                return;
            }

            // 다음 필터로 진행
            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Token expired");
        }
    }
}
