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

/**
 * @Transactional
 * - 이 메서드 내의 DB 작업을 하나의 트랜잭션으로 묶어 관리한다.
 * - 모든 작업이 정상 수행되면 자동 commit, 중간에 RuntimeException이 발생하면 자동 rollback 처리된다.
 * - 따라서 데이터 정합성을 보장할 수 있다.
 * - 주로 Service 계층에서 여러 DAO 호출을 하나의 비즈니스 로직 단위로 묶을 때 사용한다.
 */

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberDao memberDao;
    private final CartDao cartDao;   // ✅ CartDao 주입
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
            // 기본값 지정
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

        // 2. 장바구니 자동 생성 (회원 이메일 기준)
        Cart cart = new Cart();
        cart.setC_email(m.getM_email());
        cartDao.insertCart(cart);

        return m.getM_no();
    }


    @Transactional(readOnly = true)
    public Member getById(Long id) {
        return memberDao.getById(id);
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
        // 1. 이메일로 회원 조회
        Member m = memberDao.getByEmail(email);
        if (m == null) throw new IllegalArgumentException("가입되지 않은 이메일입니다.");

        // 2. 로컬 계정이면 비밀번호 검증
        if (m.getM_password() != null) {  // LOCAL 계정
            if (rawPassword == null || !passwordEncoder.matches(rawPassword, m.getM_password())) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }
        } else {
            // 3. 소셜 계정이면 비밀번호 검증 스킵
            // 필요하면 OAuth 토큰 검증 로직 추가 가능
        }

        return m;
    }

    public void updateAddress(Long id, String address) {
        memberDao.updateAddress(id, address);
    }

    public void updatePassword(Long id, String rawPw) {
        memberDao.updatePassword(id, passwordEncoder.encode(rawPw));
    }

    public void delete(Long id) {
        memberDao.deleteById(id);
    }
}
