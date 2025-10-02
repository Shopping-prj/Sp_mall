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

        // ✅ 토큰 검사에서 제외할 경로들 (로그인, 회원가입, 공개 API 등)
        if (path.startsWith("/api/users/login") ||
                path.startsWith("/api/users/join") ||
                path.startsWith("/api/users/refresh") ||
                path.startsWith("/api/payments") ||  // ✅ 추가
                path.startsWith("/api/products")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 요청 헤더에서 Authorization 추출
        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // "Bearer " 제거 후 토큰만 추출
        }

        try {
            // ✅ 토큰 유효성 검사
            if (token != null && jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmail(token);   // sub = 회원 이메일
                String role = jwtUtil.getRole(token);     // role = USER / ADMIN

                // ✅ DB에서 회원 정보 조회
                Member member = memberService.getByEmail(email);

                // ✅ 토큰의 role과 DB의 m_class가 일치하면 인증 처리
                if (member != null && role.equals(member.getM_class())) {
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

                    // SecurityContextHolder에 저장
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // Role 불일치나 사용자 없음 → 명시적으로 401
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Token or Role");
                    return;
                }
            }else {
                // 토큰 없음/유효하지 않음 → 401
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or Invalid Token");
                return;
            }

            // 다음 필터로 진행
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            // ⬅ 여기서 명시적으로 401 반환
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Token expired");
        }
    }
}