package com.example.demo.dao;

import com.example.demo.model.Member;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class MemberDao {

    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.MemberMapper.";

    public int insert(Member member) {
        return sqlSession.insert(NS + "insert", member);
    }

    public Member getById(Long id) {
        return sqlSession.selectOne(NS + "getById", id);
    }

    public Member getByEmail(String email) {
        return sqlSession.selectOne(NS + "getByEmail", email);
    }

    public List<Member> getAll() {
        return sqlSession.selectList(NS + "getAll");
    }

    public int updateAddress(Long id, String address) {
        Map<String, Object> param = new HashMap<>();
        param.put("id", id);
        param.put("address", address);
        return sqlSession.update(NS + "updateAddress", param);
    }

    public int updatePassword(Long id, String password) {
        Map<String, Object> param = new HashMap<>();
        param.put("id", id);
        param.put("password", password);
        return sqlSession.update(NS + "updatePassword", param);
    }

    public int deleteById(Long id) {
        return sqlSession.delete(NS + "deleteById", id);
    }
}
