// Cart.java
package com.example.demo.model;

import lombok.Data;
import java.sql.Timestamp;

/**
 * Cart (장바구니) 엔티티
 * - DB cart 테이블과 1:1 매핑
 * - 회원 단위 장바구니를 표현
 */
@Data
public class Cart {
    private Long c_no;          // 장바구니 PK
    private String c_email;     // 회원 이메일 (member.m_email FK)
    private Timestamp created_at; // 생성일시 (DB DEFAULT CURRENT_TIMESTAMP)
}
