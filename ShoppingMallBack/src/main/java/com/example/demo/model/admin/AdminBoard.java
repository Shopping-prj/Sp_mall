package com.example.demo.model.admin;

import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AdminBoard {
    private Long b_no;
    private String b_email;
    private String b_title;
    private String b_content;
    private LocalDateTime b_date;
}