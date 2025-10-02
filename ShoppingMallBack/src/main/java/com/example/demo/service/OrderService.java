package com.example.demo.service;

import com.example.demo.dao.OrderDao;
import com.example.demo.model.CartItem;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderDao orderDao;

    /**
     * 주문 생성 + 주문아이템 저장 + (옵션) 장바구니 비우기
     *
     * @param order   주문 마스터(이메일/주소/금액/상태 등)
     * @param items   장바구니 아이템 목록
     * @param cartNo  장바구니 번호(c_no) - null 이 아니면 비우기 실행
     */
    public void placeOrder(@NonNull Order order,
                           @NonNull List<CartItem> items,
                           Long cartNo) {

        // 1) 주문 저장 (o_no auto increment 세팅됨)
        orderDao.insertOrder(order);

        // 2) 주문 아이템 저장
        for (CartItem item : items) {
            OrderItem oi = new OrderItem();
            oi.setO_no(order.getO_no());
            oi.setOi_productId(item.getC_productId());
            oi.setOi_count(item.getC_count());
            orderDao.insertOrderItem(oi);
        }

        // 3) 장바구니 비우기 (cartNo가 있는 경우에만)
        if (cartNo != null) {
            orderDao.clearCartByCartNo(cartNo);
        }
    }
}
