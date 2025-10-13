package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * OrderItemDTO
 * - 조인하여 출력하기 위한 응답용
 * - order 엔티티 + orderItem 엔티티
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private long o_no;
    private String o_email; // 주문회원(FK 회원 m_email참조)
    private Instant o_created_at; // 주문상태
    private Long o_amount; //주문금액
    private String o_address; //배송지
    private String o_status; //주문상태

    private Long oi_count; //품목수량

    // 프론트 렌더링용 Product 정보 추가
    private String o_title;
    private long o_lprice;
    private String o_image;
    // 프론트 렌더링용 myPage 정보 추가
    private String mp_order;
}
