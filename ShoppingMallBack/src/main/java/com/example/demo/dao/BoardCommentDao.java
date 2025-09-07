package com.example.demo.dao;

import com.example.demo.model.BoardComment;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardCommentDao {
    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.BoardCommentMapper.";

    public int insert(BoardComment bc) {
        return sqlSession.insert(NS + "insert", bc);
    }

    public BoardComment getByNo(String no) {
        return sqlSession.selectOne(NS + "getByNo", no);
    }

    public List<BoardComment> getByBoardNo(String bNo) {
        return sqlSession.selectList(NS + "getByBoardNo", bNo);
    }

    public int deleteByNo(String no) {
        return sqlSession.delete(NS + "deleteByNo", no);
    }
}
