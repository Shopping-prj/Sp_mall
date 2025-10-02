package com.example.demo.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    private String pay_imp_uid;       // 결제ID (PK, PortOne 고유 ID)
    private String pay_merchant_uid;  // 가맹점 주문번호
    private String pay_pg_tid;        // PG 거래번호
    private String pay_email;         // 구매회원 (회원 email 참조)
    private Long   c_no;              // 장바구니 번호 (FK)

    private String pay_status;        // 결제상태 (ready, paid, cancelled, failed)
    private String pay_currency;      // 결제단위 (KRW)
    private Long   pay_amount;        // 결제 요청 금액
    private Long   pay_paid_amount;   // 실제 결제 완료 금액
    private Long pay_paid_at;       // 결제 완료 시각

    private String pay_buyer_email;   // 구매자 이메일
    private String pay_buyer_name;    // 구매자 이름
    private String pay_buyer_tel;     // 구매자 전화번호
    private String pay_buyer_postcode;// 우편번호
    private String pay_receipt_url;   // 결제 영수증 URL
    private String pay_address;       // 배송지
    private String pay_method;
    private String pg_provider;
}
