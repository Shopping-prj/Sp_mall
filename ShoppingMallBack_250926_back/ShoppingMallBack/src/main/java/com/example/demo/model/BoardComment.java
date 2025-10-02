package com.example.demo.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardComment {
    private String bc_no;       // 답변글번호 (PK)
    private String b_no;        // 게시글번호 (FK → board.b_no)
    private String bc_email;    // 답변자 이메일
    private String bc_comment;  // 답변내용
    private LocalDateTime bc_date; // 답변일자
}
