//package com.example.demo.dto;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//@Data
//public class PaymentDTO {
//    @JsonProperty("imp_uid")
//    private String pay_imp_uid;
//
//    @JsonProperty("merchant_uid")
//    private String pay_merchant_uid;
//
//    @JsonProperty("status")
//    private String pay_status;
//
//    @JsonProperty("pay_method")
//    private String pay_method;
//
//    @JsonProperty("pg_provider")
//    private String pg_provider;
//
//    @JsonProperty("pg_tid")
//    private String pay_pg_tid;
//
//    @JsonProperty("amount")
//    private Long pay_amount;
//
//    @JsonProperty("currency")
//    private String pay_currency;
//
//    @JsonProperty("paid_amount")
//    private Long pay_paid_amount;
//
//    @JsonProperty("paid_at")
//    private Long pay_paid_at;  // epoch second 그대로 받음
//
//    @JsonProperty("receipt_url")
//    private String pay_receipt_url;
//
//    @JsonProperty("buyer_email")
//    private String pay_email;   // DB랑 맞춤
//
//    @JsonProperty("buyer_name")
//    private String pay_buyer_name;
//
//    @JsonProperty("buyer_tel")
//    private String pay_buyer_tel;
//
//    @JsonProperty("buyer_addr")
//    private String pay_address;
//
//    @JsonProperty("buyer_postcode")
//    private String pay_buyer_postcode;
//
//    private String apply_num;
//    private String bank_name;
//    private String card_name;
//    private String card_number;
//    private Integer card_quota;
//    private Boolean success;
//    private String error_msg;
//}
