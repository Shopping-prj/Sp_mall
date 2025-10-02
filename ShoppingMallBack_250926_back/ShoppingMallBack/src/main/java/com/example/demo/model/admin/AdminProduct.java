package com.example.demo.model.admin;

import lombok.*;

@Data
public class AdminProduct {
    private String  p_productId;   // PK
    private String  p_title;       // 상품명
    private String  p_link;        // 제품링크
    private String  p_image;       // 이미지
    private Long    p_lprice;      // 가격(bigint) → Long 권장
    private String  p_hprice;      // 가격2(varchar) → String
    private String  p_mallName;    // 매장이름
    private String  p_productType; // 제품타입
    private String  p_brand;       // 브랜드
    private String  p_maker;       // 메이커
    private String  p_category1;   // 카테고리1
    private String  p_category2;   // 카테고리2
    private String  p_category3;   // 카테고리3
    private String  p_category4;   // 카테고리4
}