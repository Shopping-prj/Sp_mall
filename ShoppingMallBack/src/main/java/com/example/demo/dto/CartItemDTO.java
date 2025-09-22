// CartItemDTO.java
package com.example.demo.dto;

import lombok.*;

/**
 * CartItemDTO
 * - Controller ↔ Frontend 간 데이터 전달용
 * - CartItem 엔티티 기반으로 응답 + guest_cart 병합 시 이메일 필드 포함
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long ci_no;         // 장바구니 아이템 PK
    private Long c_no;          // 장바구니 번호
    private String c_productId; // 상품 ID
    private int c_count;        // 수량

    // guest_cart 병합 시 이메일 전달 용도 (DB에는 저장 안 함)
    private String c_email;
}
