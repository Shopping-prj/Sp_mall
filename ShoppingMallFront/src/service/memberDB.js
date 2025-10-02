// src/service/memberDB.js
import api from "./axios";

// 로그인 API만 호출, 토큰 저장은 안 함
export const loginMember = async (m_email, m_password) => {
  const res = await api({
    method: "post",
    url: "/api/users/login",
    data: { m_email, m_password },
    headers: { "Content-Type": "application/json" },
  });
  return res.data; // accessToken, refreshToken, member, role 포함
};

export const getMyInfo = async () => {
  const res = await api({
    method: "get",
    url: "/api/users/me",
  });
  return res.data;
};
