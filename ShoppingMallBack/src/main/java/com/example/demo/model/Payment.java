package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    // 포트원 결제 고유 ID
    @JsonAlias("imp_uid")
    private String pay_imp_uid;

    // 가맹점 주문번호
    @JsonAlias("merchant_uid")
    private String pay_merchant_uid;

    // PG사 거래번호
    @JsonAlias("pg_tid")
    private String pay_pg_tid;

    // 회원 이메일
    @JsonAlias({"buyer_email", "m_email"})
    private String pay_email;

    // 장바구니 번호 (프론트에서 콜백 시 포함시켜야 함)
    private Long c_no;

    // 결제 상태 (paid, cancelled 등)
    @JsonAlias("status")
    private String pay_status;

    // 통화
    private String pay_currency;

    // 요청 금액
    @JsonAlias({"amount","m_amount"})
    private Long pay_amount;

    // 실제 결제 금액
    @JsonAlias("paid_amount")
    private Long pay_paid_amount;

    // 결제 시간 (Unix timestamp → Service에서 LocalDateTime으로 변환)
    @JsonAlias("paid_at")
    private Long paid_at_unix; // JSON 그대로 받고 변환은 Service에서

    private LocalDateTime pay_paid_at; // 변환 결과 저장

    // 구매자 정보
    private String pay_buyer_email;
    @JsonAlias("buyer_name")
    private String pay_buyer_name;
    @JsonAlias("buyer_tel")
    private String pay_buyer_tel;
    @JsonAlias("buyer_postcode")
    private String pay_buyer_postcode;
    @JsonAlias("buyer_addr")
    private String pay_address;

    // 기타 정보
    @JsonAlias("receipt_url")
    private String pay_receipt_url;

    private String pay_method;
    private String pg_provider;
    private String pg_type;
    private String pay_name;
    private String error_msg;
    private Boolean success;
    private String apply_num;
    private String bank_name;
    private String card_name;
    private String card_number;
    private Integer card_quota;
}
