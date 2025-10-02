// CartItemDTO.java
package com.example.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long ci_no;         // 장바구니 아이템 PK
    private Long c_no;          // 장바구니 번호
    private String c_productId; // 상품 ID
    private int c_count;        // 수량

    // 🔹 프론트 렌더링용 Product 정보 추가
    private String p_title;
    private long p_lprice;
    private String p_image;

    // guest_cart 병합 시 이메일 전달 용도 (DB에는 저장 안 함)
    private String c_email;
}
