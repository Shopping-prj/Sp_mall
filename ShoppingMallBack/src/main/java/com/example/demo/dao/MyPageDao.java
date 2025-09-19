package com.example.demo.dao;

import com.example.demo.model.MyPage;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class MyPageDao {

    private final SqlSessionTemplate sqlSession;

    private static final String NS = "com.example.demo.dao.MyPageMapper.";

    public long insert(MyPage req) { return sqlSession.insert(NS + "insert", req); }

    public List<Map> getByEmail(String email) { return  sqlSession.selectList(NS + "getAllByEmail", email); }
}
