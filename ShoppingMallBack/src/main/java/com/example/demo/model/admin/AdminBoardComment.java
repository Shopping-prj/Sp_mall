package com.example.demo.model.admin;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminBoardComment {
    private Long bc_no;          // PK
    private String bc_email;     // 작성자 이메일
    private Long b_no;           // 게시글 번호 (FK)
    private String bc_comment;   // 댓글 내용
    private LocalDateTime bc_date; // 작성일
}