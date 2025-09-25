package com.example.demo.model.admin;

import lombok.Data;

@Data
public class AdminOrder {
    // purchaseHistory
    private Long   ph_no;                 // 주문번호
    private String ph_date;               // 주문일시 (ISO 문자열로 뽑음)
    private String ph_email;              // 주문자 이메일
    private String p_productid;           // 상품코드
    private Integer ph_count;             // 수량
    private Long   ph_payment;            // 결제금액
    private String pay_method;            // 결제수단(존재 시)

    // 상태/표기
    private String mp_order;              // 주문상태 (myPage)
    private String ph_refund_or_exchange; // 환불/교환 (purchaseHistory)

    // 상품 표시용
    private String product_title;         // 상품명 (product)
    private String product_image;         // 상품이미지 (product)

    // 배송(선택 테이블 사용 시)
    private String courier;               // 택배사
    private String invoice_no;            // 송장번호
}