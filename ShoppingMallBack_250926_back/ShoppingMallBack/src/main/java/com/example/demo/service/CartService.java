package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.model.Cart;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final CartDao dao;

    public Long register(Cart cart) {
        dao.insert(cart);
        return cart.getC_no();
    }

    @Transactional(readOnly = true)
    public Cart getByNo(Long no) {
        return dao.getByNo(no);
    }

    @Transactional(readOnly = true)
    public List<Cart> getByEmail(String email) {
        return dao.getByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Cart> getAllCart() {
        return dao.getAllCart();
    }

    public void updateCount(Long no, int count) {
        dao.updateCount(no, count);
    }

    public void delete(Long no) {
        dao.deleteByNo(no);
    }

    public void clearByEmail(String email) {
        dao.deleteByEmail(email);
    }
}
