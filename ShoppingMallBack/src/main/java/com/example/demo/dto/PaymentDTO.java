package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {

    @JsonAlias("imp_uid")
    private String pay_imp_uid;

    @JsonAlias("merchant_uid")
    private String pay_merchant_uid;

    @JsonAlias("pg_tid")
    private String pay_pg_tid;

    @JsonAlias({"status", "pay_status"})
    private String pay_status;

    @JsonAlias("currency")
    private String pay_currency;

    @JsonAlias("paid_amount")
    private Long pay_paid_amount;

    @JsonAlias("paid_at")
    private Long paid_at_unix; // UNIX timestamp → LocalDateTime 변환용

    private LocalDateTime pay_paid_at;

    @JsonAlias("buyer_email")
    private String pay_buyer_email;

    @JsonAlias("buyer_name")
    private String pay_buyer_name;

    @JsonAlias("buyer_addr")
    private String pay_address;

    @JsonAlias("receipt_url")
    private String pay_receipt_url;

    @JsonAlias("pay_method")
    private String pay_method;

    @JsonAlias("pg_provider")
    private String pg_provider;

    @JsonAlias("pg_type")
    private String pg_type;

    private Long c_no; // 장바구니 번호
}
