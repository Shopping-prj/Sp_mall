package com.example.demo.service.admin;

import com.example.demo.dao.admin.AdminMemberDao;
import com.example.demo.model.Member;
import com.example.demo.model.admin.AdminMember;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
// 필요 시 트랜잭션 켜세요.
// import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminMemberService {

    private final AdminMemberDao adminMemberDao;
    private final BCryptPasswordEncoder passwordEncoder;

    public Member getByEmailExact(String email) {
        return adminMemberDao.getByEmailExact(email);
    }

    public List<Member> search(String keywordType, String keyword,
                               String cls, String social,
                               String from, String to,
                               Integer limit, Integer offset) {
        return adminMemberDao.adminSearch(keywordType, keyword, cls, social, from, to, limit, offset);
    }

    /** 컨트롤러에서 boolean을 기대하므로, 적용 결과를 true/false로 반환 */
    // @Transactional
    public boolean update(Long mNo, AdminMember req) {
        if (mNo == null) return false;
        req.setM_no(mNo);

        // 1) 기본 정보 업데이트
        int updated = adminMemberDao.adminUpdate(req);
        if (updated == 0) {
            // 대상 없음
            return false;
        }

        // 2) 비밀번호가 전달된 경우에만 별도 업데이트
        if (req.getM_password() != null && !req.getM_password().isBlank()) {
            String hashed = passwordEncoder.encode(req.getM_password());
            adminMemberDao.adminUpdatePassword(mNo, hashed);
        }
        return true;
    }

    /** 회원 등록 */
    // @Transactional
    public void register(AdminMember member) {
        if (member.getM_password() != null && !member.getM_password().isBlank()) {
            member.setM_password(passwordEncoder.encode(member.getM_password()));
        }
        adminMemberDao.insert(member);
    }

    // ✅ 회원 삭제
    public boolean delete(Long mNo) {
        int n = adminMemberDao.delete(mNo);
        return n > 0;
    }

}