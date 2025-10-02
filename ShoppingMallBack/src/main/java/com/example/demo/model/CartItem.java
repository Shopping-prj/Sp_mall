// CartItem.java
package com.example.demo.model;

import lombok.*;

/**
 * CartItem (장바구니 상세 아이템) 엔티티
 * - DB cart_item 테이블과 1:1 매핑
 * - 장바구니 안에 담긴 개별 상품을 표현
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    private Long ci_no;         // 장바구니 아이템 PK
    private Long c_no;          // 장바구니 번호 (cart.c_no FK)
    private String c_productId; // 상품 ID (product.p_productId FK)
    private int c_count;        // 수량
}
