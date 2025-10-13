package com.example.demo.service;

import com.example.demo.dao.CartDao;
import com.example.demo.dao.OrderDao;
import com.example.demo.dao.ProductDao;
import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.dto.OrderItemDTO;
import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {
    private final OrderDao orderDao;
    private final ProductDao productDao;

    // 1. 장바구니 조회
    public List<OrderItemDTO> getOrderByEmail(String email) {
        List<OrderItemDTO> order = orderDao.getOrderByEmail(email);
        if (order == null) {
            throw new IllegalStateException("회원가입 시 주문 정보가 없습니다: " + email);
        }
        return order;
    }

    public List<OrderItemDTO> searchToOrder(Map<String, String> searchParams) {
        log.info(searchParams);
        List<OrderItemDTO> order = orderDao.searchToOrder(searchParams);
        if (order == null) {
            throw new IllegalStateException("검색 정보가 없습니다: " + searchParams);
        }
        return order;
    }
}
