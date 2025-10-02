package com.example.demo.service.admin;

import com.example.demo.dao.admin.AdminBoardCommentDao;
import com.example.demo.model.admin.AdminBoardComment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBoardCommentService {
    private final AdminBoardCommentDao dao;

    public List<AdminBoardComment> getByBoard(Long b_no) {
        return dao.findByBoard(b_no);
    }

    public AdminBoardComment getDetail(Long id) {
        return dao.findById(id);
    }

    public void insert(AdminBoardComment c) {
        dao.insert(c);
    }

    public void update(AdminBoardComment c) {
        dao.update(c);
    }

    public void delete(Long id) {
        dao.delete(id);
    }
}
