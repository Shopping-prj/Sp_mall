package com.example.demo.service.admin;

import com.example.demo.dao.admin.AdminBoardDao;
import com.example.demo.model.admin.AdminBoard;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBoardService {
    private final AdminBoardDao dao;

    public AdminBoard getDetail(Long id) { return dao.findById(id); }
    public List<AdminBoard> getAll() { return dao.findAll(); }
    public void insert(AdminBoard b) { dao.insert(b); }
    public void update(AdminBoard b) { dao.update(b); }
    public void delete(Long id) { dao.delete(id); }
}