package com.example.demo.service;

import com.example.demo.dao.MyPageDao;
import com.example.demo.dto.PaymentCancelDTO;
import com.example.demo.model.Member;
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

    @Transactional
    public int updateByUser(Member pmember) {
        if (pmember == null) {
            throw new IllegalArgumentException("요청 데이터가 누락되었습니다.");
        }
        if((pmember.getM_name().trim().length()>=1)&&(pmember.getM_address().trim().length()>=1)){
            return myPageDao.updateByUser(pmember);
        }
        else{throw new IllegalArgumentException("회원 이름 또는 주소가 유효하지 않습니다. (공백 또는 누락)");}
    }

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
    @Transactional
    public int cancelByOrder(PaymentCancelDTO paymentCancelDTO) {
        // 1. 객체 자체가 null인지 확인
        if (paymentCancelDTO == null) {
            throw new IllegalArgumentException("요청 데이터가 누락되었습니다.");
        }
        // 2. 핵심 필드 중 하나라도 유효하지 않으면 (0이거나 OR null이면) 예외 발생
        if (paymentCancelDTO.getO_no() == 0 ||
                paymentCancelDTO.getPc_email() == null ||
                paymentCancelDTO.getPc_merchant_uid() == null) {
            throw new IllegalArgumentException("필수 작성 사항이 누락되었습니다.");
        }else{
            myPageDao.cancelByOrder(paymentCancelDTO.getO_no());
            return myPageDao.insertByPCancel(paymentCancelDTO);
        }
    }
}