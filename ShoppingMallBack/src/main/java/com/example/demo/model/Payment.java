package com.example.demo.model;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * payment 테이블과 매핑되는 모델 클래스
 * DDL과 정확히 맞춤 (pay_buyer_email 없음 주의)
 */
@Data
public class Payment {
    private String pay_merchant_uid;   // 가맹점에서 만든 고유 주문번호 (PK)
    private String pay_pg_tid;         // PG사 거래번호
    private String pay_imp_uid;        // 아임포트 고유 ID (UNIQUE)
    private String pay_email;          // 결제자 이메일 (회원 외래키 FK: member.m_email)
    private Long c_no;                 // 장바구니 번호 (FK)

    private String pay_status;         // 결제 상태 (ready/paid/cancel 등)
    private String pay_currency;       // 통화 (KRW)
    private Long pay_amount;           // 결제 요청 금액
    private Long pay_paid_amount;      // 실제 결제 완료 금액
    private LocalDateTime pay_paid_at; // 결제 완료 시각

    private String pay_buyer_name;     // 구매자 이름
    private String pay_buyer_tel;      // 구매자 전화번호
    private String pay_buyer_postcode; // 구매자 우편번호
    private String pay_address;        // 구매자 주소

    private String pay_receipt_url;    // 영수증 URL
    private String pay_method;         // 결제수단 (카드/카카오페이 등)
    private String pg_provider;        // PG사명
    private String pg_type;            // 결제 타입 (payment 등)
    private String pay_name;           // 결제명 (ex. 장바구니 결제)

    private String error_msg;          // 에러 메시지
    private Boolean success;           // 성공 여부
    private String apply_num;          // 승인번호
    private String bank_name;          // 은행명
    private String card_name;          // 카드사명
    private String card_number;        // 카드번호
    private Integer card_quota;        // 할부 개월 수
}
