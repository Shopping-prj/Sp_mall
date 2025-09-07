package com.example.demo.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    private String p_productId;   // 상품코드 (PK)
    private String p_title;       // 상품제목
    private String p_link;        // 상품링크
    private String p_image;       // 상품이미지
    private String p_lprice;      // 가격1 (low price)
    private String p_hprice;      // 가격2 (high price)
    private String p_productType; // 제품타입
    private String p_brand;       // 제품브랜드
    private String p_maker;       // 제품메이커
    private String p_category1;   // 카테고리1
    private String p_category2;   // 카테고리2
    private String p_category3;   // 카테고리3
    private String p_category4;   // 카테고리4
}

