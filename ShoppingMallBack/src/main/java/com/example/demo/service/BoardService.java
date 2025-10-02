package com.example.demo.service;

import com.example.demo.dao.BoardDao;
import com.example.demo.model.Board;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    private final BoardDao dao;

    public String register(Board board) {
        dao.insert(board);
        return board.getB_no();
    }

    @Transactional(readOnly = true)
    public Board getByNo(String no) {
        return dao.getByNo(no);
    }

    @Transactional(readOnly = true)
    public List<Board> getAllBoard() {
        return dao.getAllBoard();
    }

    public void update(Board board) {
        dao.update(board);
    }

    public void delete(String no) {
        dao.deleteByNo(no);
    }
}
