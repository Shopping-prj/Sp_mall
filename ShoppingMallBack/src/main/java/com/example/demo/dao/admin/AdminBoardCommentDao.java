package com.example.demo.dao.admin;

import com.example.demo.model.admin.AdminBoardComment;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminBoardCommentDao {
    private final SqlSessionTemplate sql;
    private static final String NS = "com.example.demo.dao.admin.AdminBoardCommentMapper.";

    public AdminBoardComment findById(Long id) {
        return sql.selectOne(NS + "findById", id);
    }

    public List<AdminBoardComment> findByBoard(Long b_no) {
        return sql.selectList(NS + "findByBoard", b_no);
    }

    public List<AdminBoardComment> findAll() {
        return sql.selectList(NS + "findAll");
    }

    public int insert(AdminBoardComment c) {
        return sql.insert(NS + "insert", c);
    }

    public int update(AdminBoardComment c) {
        return sql.update(NS + "update", c);
    }

    public int delete(Long id) {
        return sql.delete(NS + "delete", id);
    }
}
