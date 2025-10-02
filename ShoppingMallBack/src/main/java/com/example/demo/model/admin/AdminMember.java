package com.example.demo.model.admin;

import lombok.Data;

@Data
public class AdminMember {
    private Long   m_no;       // PathVar에서 채워넣음
    private String m_email;    // 읽기 전용(변경 안 함) — 일관성 체크 용
    private String m_name;
    private String m_social;   // LOCAL / KAKAO / NAVER / GOOGLE
    private String m_class;    // USER / ADMIN
    private String m_address;
    private String m_password; // 선택: 있을 때만 변경
}