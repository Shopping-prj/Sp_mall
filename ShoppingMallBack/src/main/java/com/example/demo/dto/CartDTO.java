// CartDTO.java
package com.example.demo.dto;

import lombok.Data;
import java.util.List;

/**
 * CartDTO
 * - 회원 단위 장바구니 응답용
 * - Cart 엔티티 + CartItemDTO 리스트 포함
 */
@Data
public class CartDTO {
    private Long c_no;                // 장바구니 번호
    private String c_email;           // 회원 이메일
    private List<CartItemDTO> items;  // 장바구니 아이템 목록
}
