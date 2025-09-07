package com.example.demo.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {
    private Long   c_no;          // 장바구니 번호 (PK)
    private String c_email;       // 회원 이메일 (FK → member.m_email)
    private String c_productId;   // 상품코드 (FK → product.p_productId)
    private int    c_count;       // 상품수량 (기본값 1)
    private String c_payment;     // 결제수단
}
