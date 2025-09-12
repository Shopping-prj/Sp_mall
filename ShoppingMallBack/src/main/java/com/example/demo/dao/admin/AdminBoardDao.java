package com.example.demo.dao.admin;

import com.example.demo.model.admin.AdminBoard;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AdminBoardDao {

    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.admin.AdminBoardMapper.";

    public int insert(AdminBoard b) { return sqlSession.insert(NS + "insert", b); }
    public int update(AdminBoard b) { return sqlSession.update(NS + "update", b); }
    public int softDelete(String id) { return sqlSession.update(NS + "softDelete", id); }

    public AdminBoard getById(String id) { return sqlSession.selectOne(NS + "getById", id); }
    public int increaseViews(String id) { return sqlSession.update(NS + "increaseViews", id); }

    public List<AdminBoard> list(String keyword, String status, Boolean pinned, Integer offset, Integer size) {
        Map<String,Object> p = new HashMap<>();
        p.put("keyword", keyword);
        p.put("status", status);
        p.put("pinned", pinned);
        p.put("offset", offset);
        p.put("size", size);
        return sqlSession.selectList(NS + "list", p);
    }

    public long count(String keyword, String status, Boolean pinned) {
        Map<String,Object> p = new HashMap<>();
        p.put("keyword", keyword);
        p.put("status", status);
        p.put("pinned", pinned);
        return sqlSession.selectOne(NS + "count", p);
    }
}