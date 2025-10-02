package com.example.demo.config.auth;

import com.example.demo.dao.MemberDao;
import com.example.demo.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final MemberDao memberDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username → 이메일 기준으로 회원 조회
        Member member = memberDao.getByEmail(username);

        if (member == null) {
            throw new UsernameNotFoundException("가입되지 않은 이메일입니다: " + username);
        }

        return new PrincipalDetails(member);
    }
}