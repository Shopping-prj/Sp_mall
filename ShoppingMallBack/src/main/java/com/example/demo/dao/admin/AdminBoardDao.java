package com.example.demo.dao.admin;

import com.example.demo.model.admin.AdminBoard;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminBoardDao {
    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.admin.AdminBoardMapper.";

    public AdminBoard findById(Long id) { return sqlSession.selectOne(NS + "findById", id); }
    public List<AdminBoard> findAll() { return sqlSession.selectList(NS + "findAll"); }
    public int insert(AdminBoard b) { return sqlSession.insert(NS + "insert", b); }
    public int update(AdminBoard b) { return sqlSession.update(NS + "update", b); }
    public int delete(Long id) { return sqlSession.delete(NS + "delete", id); }
}