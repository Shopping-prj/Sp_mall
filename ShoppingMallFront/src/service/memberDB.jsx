import axios from "axios";

// 로컬 로그인 요청 (JWT)
export const loginMember = async (m_email, m_password) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "/proxy/api/auth/login",   // ✅ 프록시 경유 (로컬 dev 환경)
    { m_email, m_password },
    { headers: { "Authorization": `Bearer ${token}`, // JWT 헤더 필수
    "Content-Type": "application/json", } }
  );

  // 토큰 저장
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data; // { ok, token, role }
};