package com.example.demo.dao;

import com.example.demo.dto.PaymentCancelDTO;
import com.example.demo.model.Member;
import lombok.*;
import lombok.extern.log4j.Log4j2;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Log4j2
@Repository
@RequiredArgsConstructor
public class MyPageDao {

    private final SqlSessionTemplate sqlSession;


    private static final String NS = "com.example.demo.dao.MyPageMapper.";
    // 1. 회원 이메일로 회원정보 조회
    public Member getByEmail(String email) {
        log.debug("getByEmail:", email);
        return  sqlSession.selectOne(NS + "getByEmail", email);
    }
    // 2. 회원정보 수정
    public int updateByUser(Member pmember) {
        int result = 0;
        result = sqlSession.update(NS + "updateByUser", pmember);
        return result;
    }

    public int deleteById(String email) {
        int result = 0;
        result = sqlSession.delete(NS + "deleteByEmail", email);
        return result;
    }
    // 4. 주문취소
    public int cancelByOrder(long o_no) {
        int result = 0;
        result = sqlSession.update(NS + "cancelByOrder", o_no);
        return result;
    }
    public int insertByPCancel(PaymentCancelDTO paymentCancelDTO) {
        int result = 0;
        result = sqlSession.update(NS + "insertByPCancel", paymentCancelDTO);
        return result;
    }
}
