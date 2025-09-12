package com.example.demo.model.admin;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminBoard {
    private String b_id;                // PK
    private String b_title;             // 제목
    private String b_content;           // 본문
    private String b_writer;            // 작성자(관리자 계정)
    private Integer b_views;            // 조회수
    private Boolean b_pinned;           // 상단 고정 여부
    private String b_status;            // NORMAL/HIDDEN/DELETED
    private LocalDateTime b_createdAt;  // 생성일시
    private LocalDateTime b_updatedAt;  // 수정일시
}