package com.example.demo.service;

import com.example.demo.dao.OrderDao;
import com.example.demo.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final OrderDao orderDao;

    public List<Order> searchOrders(Map<String, Object> param) {
        return orderDao.searchOrders(param);
    }

    public List<Order> getAllOrders() {
        return orderDao.getAllOrders();
    }
}
