package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    private Long oi_no; //주문 상세번호(PK)
    private Long o_no; //주문번호(FK 주문의 o_no)
    private String oi_productId; //상품코드(FK 상품의 p_productId)
    private Long oi_count; //품목수량
}