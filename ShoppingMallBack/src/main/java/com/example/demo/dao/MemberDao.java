package com.example.demo.dao;

import com.example.demo.model.Member;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MemberDao {

    private final SqlSessionTemplate sqlSession;

    private static final String NS = "com.example.demo.dao.MemberMapper.";

    public int insert(Member member) {
        return sqlSession.insert(NS + "insert", member);
    }

    public Member getById(Long id) {
        return sqlSession.selectOne(NS + "findById", id);
    }

    public Member getByEmail(String email) {
        return sqlSession.selectOne(NS + "findByEmail", email);
    }

    public List<Member> getAll() {
        return sqlSession.selectList(NS + "findAll");
    }

    public int updateAddress(Long id, String address) {
        return sqlSession.update(NS + "updateAddress",
                new java.util.HashMap<>() {{
                    put("id", id);
                    put("address", address);
                }});
    }

    public int updatePassword(Long id, String password) {
        return sqlSession.update(NS + "updatePassword",
                new java.util.HashMap<>() {{
                    put("id", id);
                    put("password", password);
                }});
    }

    public int deleteById(Long id) {
        return sqlSession.delete(NS + "deleteById", id);
    }
}