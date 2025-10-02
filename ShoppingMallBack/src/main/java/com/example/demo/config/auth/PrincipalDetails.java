package com.example.demo.config.auth;

import com.example.demo.model.Member;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


public class PrincipalDetails implements UserDetails {

    private final Member member;

    public PrincipalDetails(Member member) {
        this.member = member;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // m_class 컬럼 기반 권한 부여 (예: USER, ADMIN)
        return List.of(new SimpleGrantedAuthority("ROLE_" + member.getM_class()));
    }

    @Override
    public String getPassword() {
        return member.getM_password();
    }

    @Override
    public String getUsername() {
        // 로그인 ID로 이메일 사용
        return member.getM_email();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정 만료X
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠김X
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 비밀번호 만료X
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정 활성화
    }
}