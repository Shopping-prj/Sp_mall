package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dao.MemberDao;
import com.example.demo.model.Cart;
import com.example.demo.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberDao memberDao;
    private final CartDao cartDao;   // ✅ 회원가입 시 기본 장바구니 생성
    private final BCryptPasswordEncoder passwordEncoder;

    public Long register(Member m) {
        if (m.getM_email() == null || m.getM_email().isBlank())
            throw new IllegalArgumentException("email을 입력하세요");
        if (m.getM_address() == null || m.getM_address().isBlank())
            throw new IllegalArgumentException("주소를 입력하세요");

        if (memberDao.getByEmail(m.getM_email()) != null)
            throw new DuplicateKeyException("이미 가입된 이메일입니다.");

        // social 검증
        if (m.getM_social() != null) {
            String s = m.getM_social().toUpperCase();
            if (!Set.of("LOCAL","GOOGLE","NAVER","KAKAO").contains(s))
                throw new IllegalArgumentException("허용되지 않은 social 값입니다.");
            m.setM_social(s);
        }

        // role 검증
        if (m.getM_class() == null) {
            m.setM_class("USER");
        } else {
            String r = m.getM_class().toUpperCase();
            if (!Set.of("USER","ADMIN").contains(r)) {
                throw new IllegalArgumentException("허용되지 않은 role 값입니다.");
            }
            m.setM_class(r);
        }

        // 비밀번호 정책
        String effectiveSocial = (m.getM_social() == null) ? "LOCAL" : m.getM_social();
        if ("LOCAL".equalsIgnoreCase(effectiveSocial)) {
            if (m.getM_password() == null || m.getM_password().isBlank())
                throw new IllegalArgumentException("LOCAL 가입은 비밀번호가 필요합니다.");
            m.setM_password(passwordEncoder.encode(m.getM_password()));
        } else {
            m.setM_password(null);
        }

        // 1. 회원 등록
        memberDao.insert(m);

        // 2. 장바구니 자동 생성
        Cart cart = new Cart();
        cart.setC_email(m.getM_email());
        cartDao.insertCart(cart);

        return m.getM_no();
    }

    @Transactional(readOnly = true)
    public Member getByEmail(String email) {
        return memberDao.getByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Member> getAll() {
        return memberDao.getAll();
    }

    public Member login(String email, String rawPassword) {
        Member m = memberDao.getByEmail(email);
        if (m == null) throw new IllegalArgumentException("가입되지 않은 이메일입니다.");

        if (m.getM_password() != null) {
            if (rawPassword == null || !passwordEncoder.matches(rawPassword, m.getM_password())) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }
        }
        return m;
    }

    public void updateAddressByEmail(String email, String address) {
        Member member = memberDao.getByEmail(email);
        if (member == null) throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        memberDao.updateAddress(member.getM_no(), address);
    }

    public void updatePasswordByEmail(String email, String rawPw) {
        Member member = memberDao.getByEmail(email);
        if (member == null) throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        memberDao.updatePassword(member.getM_no(), passwordEncoder.encode(rawPw));
    }

    public void deleteByEmail(String email) {
        Member member = memberDao.getByEmail(email);
        if (member == null) throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        memberDao.deleteById(member.getM_no());
    }
}
