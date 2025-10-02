package com.example.demo.service;

import com.example.demo.dao.BoardCommentDao;
import com.example.demo.model.BoardComment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardCommentService {
    private final BoardCommentDao dao;

    public String register(BoardComment bc) {
        dao.insert(bc);
        return bc.getBc_no();
    }

    @Transactional(readOnly = true)
    public BoardComment getByNo(String no) {
        return dao.getByNo(no);
    }

    @Transactional(readOnly = true)
    public List<BoardComment> getByBoardNo(String bNo) {
        return dao.getByBoardNo(bNo);
    }

    public void delete(String no) {
        dao.deleteByNo(no);
    }
}
