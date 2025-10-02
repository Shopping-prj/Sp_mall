package com.example.demo.service;


import com.example.demo.dao.MemberDao;
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
    private final BCryptPasswordEncoder passwordEncoder;

    public Long register(Member m) {

        if (m.getM_email() == null || m.getM_email().isBlank())
            throw new IllegalArgumentException("email은 필수입니다.");
        if (m.getM_address() == null || m.getM_address().isBlank())
            throw new IllegalArgumentException("address는 필수입니다.");

        if (memberDao.getByEmail(m.getM_email()) != null)
            throw new DuplicateKeyException("이미 가입된 이메일입니다.");

        // social 검증(수업 호환: 문자열). null이면 DB DEFAULT 사용(LOCAL 권장)
        if (m.getM_social() != null) {
            String s = m.getM_social().toUpperCase();
            if (!Set.of("LOCAL","GOOGLE","NAVER","KAKAO").contains(s))
                throw new IllegalArgumentException("허용되지 않은 social 값입니다.");
            m.setM_social(s);
        }

        // role 검증. null이면 DB DEFAULT 사용(USER 권장). 클라 입력은 신뢰X
        if (m.getM_class() != null) {
            String r = m.getM_class().toUpperCase();
            if (!Set.of("USER","ADMIN").contains(r))
                throw new IllegalArgumentException("허용되지 않은 role 값입니다.");
            m.setM_class(r);
        }

        // 비밀번호 정책: LOCAL만 허용/필수, 소셜은 금지
        String effectiveSocial = (m.getM_social() == null) ? "LOCAL" : m.getM_social();
        if ("LOCAL".equalsIgnoreCase(effectiveSocial)) {
            if (m.getM_password() == null || m.getM_password().isBlank())
                throw new IllegalArgumentException("LOCAL 가입은 비밀번호가 필요합니다.");
            m.setM_password(passwordEncoder.encode(m.getM_password()));
        } else {
            m.setM_password(null);
        }

        memberDao.insert(m);
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
