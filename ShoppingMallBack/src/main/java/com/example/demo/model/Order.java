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
    private Long o_no;              // 주문번호 PK
    private String o_email;         // 주문 회원
    private String o_merchant_uid;  // 결제번호 (FK)
	private Instant o_created_at;
    private Long o_amount;          // 총 금액
    private String o_address;       // 배송지
    private String o_status;        // 주문 상태 (배송준비/배송중/완료)

    // 결제 상태
    private String pay_status;

    // 상품 표시용 (조인)
    private String productTitle;
    private String productImage;
}
