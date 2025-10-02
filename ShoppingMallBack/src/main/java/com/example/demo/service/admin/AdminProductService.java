package com.example.demo.service.admin;

import com.example.demo.dao.admin.AdminProductDao;
import com.example.demo.model.admin.AdminProduct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final AdminProductDao adminProductDao;

    public AdminProduct getDetail(String productId) {
        return adminProductDao.findById(productId);
    }

    public void update(AdminProduct product) {
        adminProductDao.update(product);
    }

    public void insert(AdminProduct product) {
        adminProductDao.insert(product);
    }

    public void delete(String productId) {
        adminProductDao.delete(productId);
    }
}