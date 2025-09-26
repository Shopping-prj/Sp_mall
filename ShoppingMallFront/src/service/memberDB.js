import axios from "axios";

// 로컬로그인
export const loginMember = async (m_email, m_password) => {
  const res = await axios({
    method: "post",
    url: `${process.env.REACT_APP_SPRING_IP}/api/users/login`,
    data: { m_email, m_password },
    headers: { "Content-Type": "application/json" },
  });

  // 서버에서 토큰을 내려주면 localStorage 저장
  if (res.data.token) {
    localStorage.setItem("accessToken", res.data.token);
  }

  return res.data;
};
