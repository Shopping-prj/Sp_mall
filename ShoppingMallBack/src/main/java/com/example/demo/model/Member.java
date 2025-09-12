package com.example.demo.model;

import lombok.*;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    private Long   m_no;
    private String m_email;
    private String m_password; // BCrypt 저장
    private String m_name;
    private String m_social;   // "LOCAL","KAKAO","GOOGLE" 등
    private String m_class;    // "USER","ADMIN"
    private Instant m_created;
    private String m_address;
}
