package com.example.demo.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
    private String b_no;       // 게시글번호 (PK)
    private String b_email;    // 작성자 이메일
    private String b_title;    // 게시글 제목
    private String b_content;  // 게시글 내용
    private LocalDateTime b_date; // 작성일자
}
