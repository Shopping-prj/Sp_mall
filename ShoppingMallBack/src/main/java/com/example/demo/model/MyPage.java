package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPage {
    private String m_email; // 회원이메일(FK 회원 email참조)
    private Long ph_no; // 주문번호(FK 주문내역 ph_no참조)
    private String p_productId; // 상품코드(FK 상품 p_productId참조)
    private String mp_order; // 주문상태
}
