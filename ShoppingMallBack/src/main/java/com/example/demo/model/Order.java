package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    private Long o_no; // 주문번호(PK)
    private String o_email; // 주문회원(FK 회원 m_email참조)
    private String o_merchant_uid; // 가맹점주문번호(FK 결제 pay_merchant_uid참조)
    private Instant o_created_at; // 주문상태
    private Long o_amount; //주문금액
    private String o_address; //배송지
    private String o_status; //주문상태
}
