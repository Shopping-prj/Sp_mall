package com.example.demo.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseHistory {
    private Long   ph_no;        // 주문번호 (PK)
    private String ph_imp_uid;   // 결제ID (FK → payment.pay_imp_uid)
    private String ph_email;     // 주문회원 (FK → member.m_email)
    private int    ph_count;     // 상품수량
    private LocalDateTime ph_date; // 구매날짜
    private String ph_delivery;  // 배송여부 (예: "배송전", "배송중", "배송완료")
    private String ph_Refund_or_exchange;   // 환불/교환 여부
    private String ph_address;   // 배송지
}