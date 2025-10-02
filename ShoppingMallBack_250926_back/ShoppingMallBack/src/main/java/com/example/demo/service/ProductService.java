package com.example.demo.service;

import com.example.demo.dao.ProductDao;
import com.example.demo.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductDao productDao;

    /** 등록 */
    public void insert(Product product) {
        productDao.insert(product);          // mapper: insert
    }

    /** 단건 조회 */
    @Transactional(readOnly = true)
    public Product getById(String id) {
        return productDao.getById(id);
    }

    /** 목록 조회 */
    @Transactional(readOnly = true)
    public List<Product> getAll() {
        return productDao.getAll();
    }

    /** 수정 */
    public void update(Product product) {
        productDao.update(product);
    }

    /** 삭제 */
    public void delete(String id) {
        productDao.deleteById(id);
    }
}
