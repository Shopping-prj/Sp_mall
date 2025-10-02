package com.example.demo.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseCancel {
    private String pc_imp_uid;       // 결제ID
    private String pc_merchant_uid;  // 가맹점 주문번호
    private String pc_pg_tid;        // PG거래번호
    private String pc_email;         // 취소회원
    private String pc_fail_reason;   // 실패사유 (cancelled, failed)
    private String pc_currency;      // 결제단위 (KRW)
    private Long   pc_cancel_amount; // 취소 금액
    private LocalDateTime pc_failed_at;    // 실패 시각
    private LocalDateTime pc_cancelled_a;  // 취소 시각
    private String pc_cancel_history; // 부분취소 내역
}
