package com.example.demo.dto;

import lombok.Data;

@Data
public class PaymentCancelDTO {
    private Long o_no;                 // 장바구니번호
    private String pc_fail_reason;     // 취소사유
    private String pc_email;           // 회원 이메일
    private String pc_merchant_uid;    // 가맹점주문번호
}
