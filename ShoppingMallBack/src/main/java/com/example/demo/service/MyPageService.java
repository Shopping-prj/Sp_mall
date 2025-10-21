package com.example.demo.service;

import com.example.demo.dao.MyPageDao;
import com.example.demo.model.Member;
import com.example.demo.model.MyPage;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class MyPageService {

    private final MyPageDao myPageDao;
    private final BCryptPasswordEncoder passwordEncoder;
    // 1. 회원 이메일로 회원정보 조회
    @Transactional(readOnly = true)
    public Member getByEmail(String email) {return myPageDao.getByEmail(email);}

    public int updateByUser(Member pmember) {return myPageDao.updateByUser(pmember);}

    public String passwordByVerification(Member pmember) {
        // 1. 사용자가 입력한 원문 비밀번호
        String rawPassword = pmember.getM_password();

        // 2. 데이터베이스에서 가져온 해시된 비밀번호
        String encodedPasswordFromDB = myPageDao.getByEmail(pmember.getM_email()).getM_password();

        // 3. PasswordEncoder.matches()를 사용하여 비교
        if (passwordEncoder.matches(rawPassword, encodedPasswordFromDB)) {
            String result = "비밀번호가 일치합니다";
            return result;
        } else {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다");
        }
    }

    public String deleteByEmail(String email) {
        Member rmember = myPageDao.getByEmail(email);
        log.info(rmember);
        if (rmember == null) {
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        }else {
            int result = myPageDao.deleteById(email);
            if (result == 1) {
                String message = "탈퇴성공";
                return message;
            } else {
                throw new IllegalStateException("데이터베이스 처리 오류로 인해 탈퇴에 실패했습니다.");
            }
        }
    }
}