package com.example.demo.service.admin;

import com.example.demo.dao.admin.AdminBoardDao;
import com.example.demo.model.admin.AdminBoard;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminBoardService {

    private final AdminBoardDao adminBoardDao;

    public String create(AdminBoard b) {
        if (b.getB_views() == null) b.setB_views(0);
        if (b.getB_status() == null) b.setB_status("NORMAL");
        if (b.getB_pinned() == null) b.setB_pinned(false);
        b.setB_createdAt(LocalDateTime.now());
        b.setB_updatedAt(LocalDateTime.now());
        adminBoardDao.insert(b);
        return b.getB_id();
    }

    public void update(String id, AdminBoard b) {
        b.setB_id(id);
        b.setB_updatedAt(LocalDateTime.now());
        adminBoardDao.update(b);
    }

    public void delete(String id) { adminBoardDao.softDelete(id); }

    @Transactional(readOnly = true)
    public AdminBoard detail(String id, boolean increaseView) {
        if (increaseView) adminBoardDao.increaseViews(id);
        return adminBoardDao.getById(id);
    }

    @Transactional(readOnly = true)
    public List<AdminBoard> list(String keyword, String status, Boolean pinned, int page, int size) {
        int offset = (Math.max(page, 1) - 1) * size;
        return adminBoardDao.list(keyword, status, pinned, offset, size);
    }

    @Transactional(readOnly = true)
    public long count(String keyword, String status, Boolean pinned) {
        return adminBoardDao.count(keyword, status, pinned);
    }
}