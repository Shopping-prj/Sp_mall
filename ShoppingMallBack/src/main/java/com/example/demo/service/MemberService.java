package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dao.MemberDao;
import com.example.demo.model.Cart;
import com.example.demo.model.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MemberService {

    private final MemberDao memberDao;
    private final CartDao cartDao;   // ✅ 회원가입 시 기본 장바구니 생성
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * ✅ 회원가입
     * - LOCAL만 비밀번호·주소 필수
     * - 소셜(GOOGLE/NAVER/KAKAO)은 비밀번호 없이 가입 가능
     */
    public Long register(Member m) {
        // 0️⃣ 공통 검증
        if (m.getM_email() == null || m.getM_email().isBlank())
            throw new IllegalArgumentException("email을 입력하세요");

        // 1️⃣ 중복 이메일 체크
        if (memberDao.getByEmail(m.getM_email()) != null)
            throw new DuplicateKeyException("이미 가입된 이메일입니다.");

        // 2️⃣ social 정규화 및 검증
        String social = (m.getM_social() == null) ? "LOCAL" : m.getM_social().toUpperCase();
        m.setM_social(social);
        if (!Set.of("LOCAL", "GOOGLE", "NAVER", "KAKAO").contains(social))
            throw new IllegalArgumentException("허용되지 않은 social 값입니다.");

        // 3️⃣ role 설정 및 검증
        if (m.getM_class() == null) {
            m.setM_class("USER");
        } else {
            String role = m.getM_class().toUpperCase();
            if (!Set.of("USER", "ADMIN").contains(role))
                throw new IllegalArgumentException("허용되지 않은 role 값입니다.");
            m.setM_class(role);
        }

        // 4️⃣ 주소 정책
        if ("LOCAL".equals(social)) {
            if (m.getM_address() == null || m.getM_address().isBlank())
                throw new IllegalArgumentException("주소를 입력하세요");
        } else {
            if (m.getM_address() == null) m.setM_address("");
        }

        // 5️⃣ 비밀번호 정책
        if ("LOCAL".equals(social)) {
            if (m.getM_password() == null || m.getM_password().isBlank())
                throw new IllegalArgumentException("LOCAL 가입은 비밀번호가 필요합니다.");
            m.setM_password(passwordEncoder.encode(m.getM_password()));
        } else {
            m.setM_password(null);
        }

        // 6️⃣ 회원 등록
        memberDao.insert(m);

        // 7️⃣ 기본 장바구니 자동 생성
        Cart cart = new Cart();
        cart.setC_email(m.getM_email());
        cartDao.insertCart(cart);

        return m.getM_no();
    }

    /**
     * ✅ 단건 조회 (이메일)
     */
    @Transactional(readOnly = true)
    public Member getByEmail(String email) {
        return memberDao.getByEmail(email);
    }

    /**
     * ✅ 단건 조회 (번호)
     */
    @Transactional(readOnly = true)
    public Member getById(Long mNo) {
        return memberDao.getById(mNo);
    }

    /**
     * ✅ 전체 회원 조회
     */
    @Transactional(readOnly = true)
    public List<Member> getAll() {
        return memberDao.getAll();
    }

    /**
     * ✅ 관리자 검색 조건 조회
     */
    @Transactional(readOnly = true)
    public List<Member> search(String keywordType, String keyword,
                               String cls, String social,
                               String from, String to) {
        return memberDao.search(keywordType, keyword, cls, social, from, to);
    }

    /**
     * ✅ 로그인
     * - LOCAL은 비밀번호 검증
     * - 소셜은 비밀번호 없이 바로 통과
     */
    public Member login(String email, String rawPassword) {
        Member m = memberDao.getByEmail(email);
        if (m == null)
            throw new IllegalArgumentException("가입되지 않은 이메일입니다.");

        if (m.getM_password() != null) {
            if (rawPassword == null || !passwordEncoder.matches(rawPassword, m.getM_password()))
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return m;
    }

    /**
     * ✅ 주소 업데이트 (이메일 기반)
     */
    public void updateAddressByEmail(String email, String address) {
        Member member = memberDao.getByEmail(email);
        if (member == null)
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        memberDao.updateAddress(member.getM_no(), address);
    }

    /**
     * ✅ 비밀번호 업데이트 (이메일 기반)
     */
    public void updatePasswordByEmail(String email, String rawPw) {
        Member member = memberDao.getByEmail(email);
        if (member == null)
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        memberDao.updatePassword(member.getM_no(), passwordEncoder.encode(rawPw));
    }

    /**
     * ✅ 회원 삭제 (이메일 기반)
     */
    public void deleteByEmail(String email) {
        Member member = memberDao.getByEmail(email);
        if (member == null)
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        memberDao.deleteById(member.getM_no());
    }

    /**
     * ✅ 회원 수정 (번호 기반)
     * - 번호, 이메일, 가입일자 제외
     */
    public void updateMemberInfo(Long mNo, Member updated) {
        Member origin = memberDao.getById(mNo);
        if (origin == null)
            throw new IllegalArgumentException("존재하지 않는 회원입니다. id=" + mNo);

        // 수정 가능한 항목만 반영
        origin.setM_name(updated.getM_name());
        origin.setM_social(updated.getM_social());
        origin.setM_class(updated.getM_class());
        origin.setM_address(updated.getM_address());

        // 비밀번호는 입력했을 때만 갱신
        if (updated.getM_password() != null && !updated.getM_password().isBlank()) {
            origin.setM_password(passwordEncoder.encode(updated.getM_password()));
        }

        memberDao.update(origin);
    }

    /**
     * ✅ 최근 가입 회원 5명
     */
    @Transactional(readOnly = true)
    public List<Member> getRecentMembers() {
        return memberDao.getRecentMembers();
    }

    /**
     * ✅ 비밀번호 확인 (마이페이지용)
     */
    public boolean checkPassword(String email, String inputPw) {
        Member member = memberDao.getByEmail(email);
        if (member == null) return false;
        return passwordEncoder.matches(inputPw, member.getM_password());
    }
}
