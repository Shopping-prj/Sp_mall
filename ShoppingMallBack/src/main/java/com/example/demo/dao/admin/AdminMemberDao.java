package com.example.demo.dao.admin;

import com.example.demo.model.Member;
import com.example.demo.model.admin.AdminMember;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AdminMemberDao {

    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.admin.AdminMemberMapper.";

    public Member getByEmailExact(String email) {
        return sqlSession.selectOne(NS + "getByEmailExact", email);
    }

    public List<Member> adminSearch(String keywordType, String keyword,
                                    String cls, String social,
                                    String from, String to,
                                    Integer limit, Integer offset) {
        Map<String, Object> p = new HashMap<>();
        p.put("keywordType", keywordType);
        p.put("keyword", keyword);
        p.put("cls", cls);
        p.put("social", social);
        p.put("from", from);
        p.put("to", to);
        p.put("limit", limit);
        p.put("offset", offset);
        return sqlSession.selectList(NS + "adminSearch", p);
    }

    public int adminUpdate(AdminMember req) {
        return sqlSession.update(NS + "adminUpdate", req);
    }

    public int adminUpdatePassword(Long mNo, String hashed) {
        Map<String, Object> p = new HashMap<>();
        p.put("m_no", mNo);
        p.put("hashed", hashed);
        return sqlSession.update(NS + "adminUpdatePassword", p);
    }

    public int insert(AdminMember member) {
        return sqlSession.insert(NS + "insert", member);
    }

    // ✅ 회원 삭제
    public int delete(Long mNo) {
        return sqlSession.delete(NS + "delete", mNo);
    }


}