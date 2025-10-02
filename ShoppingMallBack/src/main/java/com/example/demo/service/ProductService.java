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

    public String addProduct(Product product) {
        productDao.addProduct(product);
        return product.getP_productId();
    }

    @Transactional(readOnly = true)
    public Product getById(String id) {
        return productDao.getById(id);
    }

    @Transactional(readOnly = true)
    public List<Product> getAll() {
        return productDao.getAll();
    }

    public void update(Product product) {
        productDao.update(product);
    }

    public void delete(String id) {
        productDao.deleteById(id);
    }

    public List<Product> getByCategories(String category) {
        return productDao.getByCategory(category);
    }

    public List<Product> search(String keyword) {
        return productDao.search("%" + keyword + "%");
    }

}
