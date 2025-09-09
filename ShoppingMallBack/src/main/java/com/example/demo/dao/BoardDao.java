package com.example.demo.dao;

import com.example.demo.model.Board;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardDao {
    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.BoardMapper.";

    public int insert(Board board) {
        return sqlSession.insert(NS + "insert", board);
    }

    public Board getByNo(String no) {
        return sqlSession.selectOne(NS + "getByNo", no);
    }

    public List<Board> getAllBoard() {
        return sqlSession.selectList(NS + "getAllBoard");
    }

    public int update(Board board) {
        return sqlSession.update(NS + "update", board);
    }

    public int deleteByNo(String no) {
        return sqlSession.delete(NS + "deleteByNo", no);
    }
}
