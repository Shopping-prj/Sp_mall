package com.example.demo.model;

import lombok.Data;

@Data
public class OrderItem {
    private Long oi_no;        // PK
    private Long o_no;         // 주문번호 FK
    private String oi_productId; // 상품코드
    private int oi_count;        // 수량
}