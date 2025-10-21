package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * payment 테이블과 매핑되는 모델 클래스
 * DDL과 정확히 맞춤 (pay_buyer_email 없음 주의)
 */
@Data
public class Payment {
    @JsonProperty("pay_merchant_uid")
    private String pay_merchant_uid;

    @JsonProperty("pay_pg_tid")
    private String pay_pg_tid;

    @JsonProperty("pay_imp_uid")
    private String pay_imp_uid;

    @JsonProperty("pay_email")
    private String pay_email;

    @JsonProperty("c_no")
    private Long c_no;

    @JsonProperty("pay_status")
    private String pay_status;

    @JsonProperty("pay_currency")
    private String pay_currency;

    @JsonProperty("pay_amount")
    private Long pay_amount;

    @JsonProperty("pay_paid_amount")
    private Long pay_paid_amount;

    @JsonProperty("pay_paid_at")
    private LocalDateTime pay_paid_at;

    @JsonProperty("pay_buyer_name")
    private String pay_buyer_name;

    @JsonProperty("pay_buyer_tel")
    private String pay_buyer_tel;

    @JsonProperty("pay_buyer_postcode")
    private String pay_buyer_postcode;

    @JsonProperty("pay_address")
    private String pay_address;

    @JsonProperty("pay_receipt_url")
    private String pay_receipt_url;

    @JsonProperty("pay_method")
    private String pay_method;

    @JsonProperty("pg_provider")
    private String pg_provider;

    @JsonProperty("pg_type")
    private String pg_type;

    @JsonProperty("pay_name")
    private String pay_name;

    @JsonProperty("error_msg")
    private String error_msg;

    @JsonProperty("success")
    private Boolean success;

    @JsonProperty("apply_num")
    private String apply_num;

    @JsonProperty("bank_name")
    private String bank_name;

    @JsonProperty("card_name")
    private String card_name;

    @JsonProperty("card_number")
    private String card_number;

    @JsonProperty("card_quota")
    private Integer card_quota;
}
