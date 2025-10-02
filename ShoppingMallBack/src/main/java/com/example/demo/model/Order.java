package com.example.demo.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Order {
    private Long o_no;            // 주문번호 PK
    private String o_email;       // 주문 회원
    private String o_merchant_uid;// 결제번호 (FK)
    private LocalDateTime o_created_at;
    private Long o_amount;        // 총 금액
    private String o_address;     // 배송지
    private String o_status;      // 주문 상태 (배송준비/배송중/완료)
}